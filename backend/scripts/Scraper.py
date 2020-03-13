import requests
from bs4 import BeautifulSoup
import pandas as pd

class Scraper:
    def __scrape(self, url, html_id):
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

    def retrieve_top_gainers_hourly(self):
        return self.__scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'gainers')

    def retrieve_top_losers_hourly(self):
        return self.__scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'losers')

    def retrieve_top_gainers_daily(self):
        return self.__scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'gainers')

    def retrieve_top_losers_daily(self):
        return self.__scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'losers')

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

# print(retrieve_top_gainers_hourly())
# print(retrieve_top_losers_hourly())
# print(retrieve_top_losers_daily())
# print(retrieve_top_gainers_daily())
