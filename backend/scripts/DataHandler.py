import decimal
import hmac
import json
import math
import os
import os.path
import time
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urljoin

import pandas as pd
import requests
from binance.client import Client
from dateutil import parser
from dotenv import load_dotenv
from bs4 import BeautifulSoup


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
                           "1h": 60, "1d": 1440, "1M": 2592000}
        self.binance_client = Client(
            api_key=self.__apiKey, api_secret=self.__secretKey)
        self._klines = ["1m", "5m", "1h", "1d", "1w", "1m"]
        self._startTimes = {"1m": "1 Feb 2020", "5m": "1 Feb 2020", "1h": "1 Feb 2020",
                            "1d": "1 Jan 2019", "1w": "1 Jan 2019", "1M": "1 Jan 2018"}

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
        filename = Path(Path().absolute(), "cryptoData", '%s-%s-data.csv' %
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
        if save:
            data_df.to_csv(filename)
        print('All caught up..!')
        return data_df

    def getAllCryptoDataBinance(self, kline_size, save):
        allCryptos = self.getcryptoSymbols(tether="USDT")[0:5]
        for crypto in allCryptos:
            self.getCryptoDataBinance(
                crypto, kline_size, save=True)

class _Scraper:
    def scrape(self, url, html_id):
        top_10 = []
        res = requests.get(url)
        soup = BeautifulSoup(res.content, 'html.parser')
        for ele in soup.find(id=html_id).find('tbody').find_all('tr')[:10]:
            tmp = {}
            info = ele.find_all('td')
            tmp['Rank'] = int(info[0].find('a').text)
            tmp['Symbol'] = info[1].find('a').text
            tmp['Market Cap'] = self.__normalize_val(info[2].find('a').text)
            tmp['Price'] = self.__normalize_val(info[3].find('a').text)
            tmp['Volume'] = self.__normalize_val(info[4].find('a').text)
            top_10.append(tmp)
        return top_10

    def __normalize_val(self, val):
        val = val[1:].replace(',','')
        if val[-1] == "K":
                val = float(val[:-1]) * 1000
        elif val[-1] == "M":
            val = float(val[:-1]) * 1000000
        elif val[-1] == "B":
            val = float(val[:-1]) * 1000000000
        else:
            val = float(val)
        return val

def retrieve_top_gainers_hourly():
    sc = _Scraper()
    return sc.scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'gainers')

def retrieve_top_losers_hourly():
    sc = _Scraper()
    return sc.scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'losers')

def retrieve_top_gainers_daily():
    sc = _Scraper()
    return sc.scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'gainers')

def retrieve_top_losers_daily():
    sc = _Scraper()
    return sc.scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'losers')

if __name__ == "__main__":
    # BinanceWrapper().getAllCryptoDataBinance("1m", save=True)
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
