from dotenv import load_dotenv
from binance.client import Client
import pandas as pd
from dateutil import parser
from bs4 import BeautifulSoup
import requests
import pymongo
import hmac
import json
import math
import os
import os.path
import time
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urljoin
import json
if __name__ == "__main__":
    import cryptocalculator
    import channelfinder
    os.chdir(Path(".."))
else:
    from . import channelfinder, cryptocalculator

# from channelfinder import ChannelFinder


# from . import channelfinder, cryptocalculator

# os.chdir(Path(".."))
DATABASE_URL = "mongodb+srv://admin:RERWw4ifyreSYuiG@cryptoviz-f2rwb.azure.mongodb.net/test?retryWrites=true&w=majority"


class BinanceWrapper:
    def __init__(self):
        self._urlBase = 'https://api.binance.com'
        self._endpoints = {
            'klines': '/api/v1/klines',
            "exchangeInfo": '/api/v1/exchangeInfo'
        }
        self.__apiKey = os.getenv('API_KEY')
        self.__secretKey = os.getenv('SECRET_KEY')
        self._intervals = {"1m": 1, "5m": 5,
                           "1h": 60, "1d": 1440, "1w": 10080, "1M": 2592000}
        self.binance_client = Client(
            api_key=self.__apiKey, api_secret=self.__secretKey)
        self.klines = ["1m", "5m", "1h", "1d", "1w", "1M"]
        self._startTimes = {"1m": "1 Feb 2020", "5m": "1 Feb 2020", "1h": "1 Feb 2020",
                            "1d": "1 Jan 2019", "1w": "1 Jan 2019", "1M": "1 Jan 2018"}
        self._indicator_calculator = cryptocalculator.CryptoCalculator()
        self._supportedResolutions = [
            "1",
            "5",
            "60",
            "1D",
            "1W",
            "1M",
        ]
        # self._chanel_calculator = channelfinder.ChannelFinder()
        self.tethers = ["USDT"]

    def getcryptoSymbols(self, tether=None):
        url = urljoin(self._urlBase, self._endpoints['exchangeInfo'])
        try:
            response = requests.get(url)
            data = json.loads(response.text)
        except Exception as e:
            print(" Exception occured when trying to access "+url)
            print(e)
            return []

        symbols_list = []

        for pair in data['symbols']:
            if pair['status'] == 'TRADING':
                if((tether and tether in pair['symbol']) or not tether):
                    symbols_list.append(pair['symbol'])

        return symbols_list

    def minutes_of_new_data(self, symbol, kline_size, data, source):
        if len(data) > 0:
            old = parser.parse(data["timestamp"].iloc[-1])
        elif source == "binance":
            old = datetime.strptime(self._startTimes[kline_size], '%d %b %Y')
        if source == "binance":
            new = pd.to_datetime(self.binance_client.get_klines(
                symbol=symbol, interval=kline_size)[-1][0], unit='ms')
        return old, new

    def getCryptoDataBinance(self, symbol, kline_size, save=False):
        Path("lib", "cryptoData").mkdir(parents=True, exist_ok=True)
        filename = Path(Path().absolute(), "lib", "cryptoData", '%s-%s-data.gz' %
                        (symbol, kline_size))

        if filename.exists():
            data_df = pd.read_csv(filename)
        else:
            data_df = pd.DataFrame()
        oldest_point, newest_point = self.minutes_of_new_data(
            symbol, kline_size, data_df, source="binance")
        delta_min = (newest_point - oldest_point).total_seconds()/60
        available_data = math.ceil(delta_min/self._intervals[kline_size])
        if oldest_point == datetime.strptime('1 Feb 2020', '%d %b %Y'):
            print('Downloading all available %s data for %s. Be patient..!' %
                  (kline_size, symbol))
        else:
            print('Downloading %d minutes of new data available for %s, i.e. %d instances of %s data.' % (
                delta_min, symbol, available_data, kline_size))
        klines = self.binance_client.get_historical_klines(symbol, kline_size, oldest_point.strftime(
            "%d %b %Y %H:%M:%S"), newest_point.strftime("%d %b %Y %H:%M:%S"))
        data = pd.DataFrame(klines, columns=['timestamp', 'open', 'high', 'low', 'close',
                                             'volume', 'close_time', 'quote_av', 'trades', 'tb_base_av', 'tb_quote_av', 'ignore'])
        data['timestamp'] = pd.to_datetime(data['timestamp'], unit='ms')
        if len(data_df) > 0:
            temp_df = pd.DataFrame(data)
            data_df = data_df.append(temp_df)
        else:
            data_df = data
        data_df.set_index('timestamp', inplace=True)
        closing_data = [float(price) for price in data_df['close'].tolist()]
        data_df['rsi'] = self._indicator_calculator.rsi(closing_data)
        data_df['ema'] = self._indicator_calculator.ema(closing_data)
        data_df['sma'] = self._indicator_calculator.sma(closing_data)
        data_df['lbb'] = self._indicator_calculator.lbb(closing_data)
        data_df['ubb'] = self._indicator_calculator.ubb(closing_data)
        data_df['mbb'] = self._indicator_calculator.mbb(closing_data)
        # period = 3 if kline_size is "1M" or kline_size is "1w" else 20
        # if len(data.index) > period:
        #     closing_price = data.tail(period)['close']
        #     closing_price.columns = ["price"]
        #     self._chanel_calculator.find_resistance(closing_price)
        #     closing_price = pd.DataFrame(closing_price)
        #     closing_price.plot()
        if save:
            data_df.to_csv(filename, compression='gzip')
        print('All caught up..!')
        return data_df

    def getAllCryptoDataBinance(self, kline_size, save):
        allCryptos = self.getcryptoSymbols(tether="USDT")
        for crypto in allCryptos:
            self.getCryptoDataBinance(
                crypto, kline_size, save)

    def retrieveCryptoData(self, symbol, kline_size):
        filename = Path(Path().absolute(), "lib", "cryptoData", '%s-%s-data.gz' %
                        (symbol, kline_size))
        if not filename.exists():
            return None
        return pd.read_csv(filename)

    def retrieve_subset_data(self, symbol, kline_size, to, fromdate):
        df = self.retrieveCryptoData(symbol, kline_size)
        df = df[(df["timestamp"] >= fromdate) &
                (df["timestamp"] <= to)]
        df = df[["close", "high", "low", "volume", "open", "timestamp"]]
        return df

    def config(self):
        return ({"exchanges": [
            {
                "value": "BINANCE",
                "name": "Binance",
                "desc": "Binance Exchange"
            }
        ], "symbols_types": [
            {
                "value": "crypto",
                "name": "Cryptocurrency"
            }
        ], "supported_resolutions": self._supportedResolutions, "supports_search": True,
            "supports_group_request": False,
            "supports_marks": False,
            "supports_timescale_marks": False,
            "supports_time": True})

    def symbolsInfo(self, symbol, symbolName=None):
        symbolTether = ""
        for tether in self.tethers:
            if tether in symbol:
                symbolTether = tether
                break
        symbolNoTether = symbol.replace(symbolTether, "")
        currValuePing = (self.binance_client.get_klines(
            symbol=symbol, interval="1m", limit=1))
        if(len(currValuePing) == 0):
            return None
        currValuePing = float(currValuePing[0][4])
        pricescale = 100
        # TODO: add more pricescale
        if(currValuePing > 1 and currValuePing < 9):
            pricescale = 1000
        elif(currValuePing > 9 and currValuePing < 100):
            pricescale = 10000
        elif(currValuePing < 1):
            pricescale = 1000000
        return ({"symbol": symbol, "ticker": symbol, "name": symbol, "full_name": symbolName if symbolName else symbol,
                 "description": symbolNoTether + " / " + symbolTether, "exchange": "BINANCE", "listed_exchange": "BINANCE",
                 "type": "crypto", "currency_code": symbolName if symbolName else "USDT", "session": "24x7",
                 "timezone": "UTC",
                 "minmovement": 1,
                 "minmov": 1,
                 "minmovement2": 0,
                 "minmov2": 0, "pricescale": pricescale, "supported_resolutions": self._supportedResolutions,
                 "has_intraday": True,
                 "has_daily": True,
                 "has_weekly_and_monthly": True,
                 "data_status": "streaming"})

    def history(self, to, fromDate, symbol, resolution):
        RESOLUTIONS_INTERVALS_MAP = {
            "1": "1m",
            "3": "3m",
            "5": "5m",
            "15": "15m",
            "30": "30m",
            "60": "1h",
            "120": "2h",
            "240": "4h",
            "360": "6h",
            "480": "8h",
            "720": "12h",
            "D": "1d",
            "1D": "1d",
            "3D": "3d",
            "W": "1w",
            "1W": "1w",
            "M": "1M",
            "1M": "1M",
        }
        if(resolution not in RESOLUTIONS_INTERVALS_MAP or to < fromDate):
            return None
        interval = RESOLUTIONS_INTERVALS_MAP[resolution]
        to = datetime.utcfromtimestamp(int(to)).strftime('%Y-%m-%d %H:%M:%S')
        fromDate = datetime.utcfromtimestamp(
            int(fromDate)).strftime('%Y-%m-%d %H:%M:%S')
        return self.retrieve_subset_data(symbol, interval, to, fromDate)


class _Scraper:
    def scrape(self, url):
        top_10 = []
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        count = 1
        for ele in soup.find(id='react-listview').find('tbody').find_all('tr')[:10]:
            tmp = {}
            info = ele.find_all('td')
            tmp['rank'] = count
            tmp['symbol'] = info[1].find('div', class_='screener-symbol').text
            tmp['market_cap'] = info[2].find('a').text
            tmp['price'] = info[3].find('a').text
            tmp['volume'] = info[4].find('a').text
            top_10.append(tmp)
            count += 1
        return top_10

    # def __normalize_val(self, val):
    #     val = val[1:].replace(',','')
    #     if val[-1] == "K":
    #             val = float(val[:-1]) * 1000
    #     elif val[-1] == "M":
    #         val = float(val[:-1]) * 1000000
    #     elif val[-1] == "B":
    #         val = float(val[:-1]) * 1000000000
    #     else:
    #         val = float(val)
    #     return val


def retrieve_top_gainers_hourly():
    sc = _Scraper()
    result = sc.scrape(
        'https://bitscreener.com/screener/?o=per_1h&desc=true&f=e_Binance')
    # client = pymongo.MongoClient(DATABASE_URL)
    # db = client["cryptoviz"]
    # gainers = db['top_gainers_hourly']
    # gainers.delete_many({})
    # gainers.insert_many(result)
    return result


def retrieve_top_losers_hourly():
    sc = _Scraper()
    result = sc.scrape(
        'https://bitscreener.com/screener/?o=per_1h&desc=false&f=e_Binance')
    # client = pymongo.MongoClient(DATABASE_URL)
    # db = client["cryptoviz"]
    # losers = db['top_losers_hourly']
    # losers.delete_many({})
    # losers.insert_many(result)
    return result


def retrieve_top_gainers_daily():
    sc = _Scraper()
    result = sc.scrape(
        'https://bitscreener.com/screener/?o=per_24h&desc=true&f=e_Binance')
    # client = pymongo.MongoClient(DATABASE_URL)
    # db = client["cryptoviz"]
    # gainers = db['top_gainers_daily']
    # gainers.delete_many({})
    # gainers.insert_many(result)
    return result


def retrieve_top_losers_daily():
    sc = _Scraper()
    result = sc.scrape(
        'https://bitscreener.com/screener/?o=per_24h&desc=false&f=e_Binance')
    # client = pymongo.MongoClient(DATABASE_URL)
    # db = client["cryptoviz"]
    # losers = db['top_losers_daily']
    # losers.delete_many({})
    # losers.insert_many(result)
    return result


if __name__ == "__main__":
    # BinanceWrapper().getCryptoDataBinance("KEYUSDT", "1d")
    print(BinanceWrapper().getCryptoDataBinance(
        "BTCUSDT", "1w", save=True).tail())
    # # dynamoTable.put_item(
    # #     item={
    # #         'Ticker': "BTCUSDT",
    # #         'Price': 28
    # #     }
    # # )
    # # response = dynamoTable.get_item(
    # #     Key={
    # #         'Ticker': "BTCUSDT"
    # #     }
    # # )
    # # print(response)
    # print(retrieve_top_gainers_hourly())
    # print(retrieve_top_losers_hourly())
    # print(retrieve_top_losers_daily())
    # print(retrieve_top_gainers_daily())
    pass
