import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape(url, html_id):
    top_10 = []
    res = requests.get(url)
    soup = BeautifulSoup(res.content, 'html.parser')
    count = 0
    for ele in soup.find(id=html_id).find('tbody').find_all('tr'):
        tmp = {}
        info = ele.find_all('td')
        tmp['Rank'] = int(info[0].find('a').text)
        tmp['Symbol'] = info[1].find('a').text
        tmp['Market Cap'] = info[2].find('a').text[1:].replace(',','')
        if tmp['Market Cap'][-1] == "K":
            tmp['Market Cap'] = float(tmp['Market Cap'][:-1]) * 1000
        elif tmp['Market Cap'][-1] == "M":
            tmp['Market Cap'] = float(tmp['Market Cap'][:-1]) * 1000000
        elif tmp['Market Cap'][-1] == "B":
            tmp['Market Cap'] = float(tmp['Market Cap'][:-1]) * 1000000000
        else:
            tmp['Market Cap'] = float(tmp['Market Cap'])
        tmp['Price'] = info[3].find('a').text[1:].replace(',','')
        if tmp['Price'][-1] == "K":
            tmp['Price'] = float(tmp['Price'][:-1]) * 1000
        elif tmp['Price'][-1] == "M":
            tmp['Price'] = float(tmp['Price'][:-1]) * 1000000
        elif tmp['Price'][-1] == "B":
            tmp['Price'] = float(tmp['Price'][:-1]) * 1000000000
        else:
            tmp['Price'] = float(tmp['Price'])
        tmp['Volume'] = info[4].find('a').text[1:].replace(',','')
        if tmp['Volume'][-1] == "K":
            tmp['Volume'] = float(tmp['Volume'][:-1]) * 1000
        elif tmp['Volume'][-1] == "M":
            tmp['Volume'] = float(tmp['Volume'][:-1]) * 1000000
        elif tmp['Volume'][-1] == "B":
            tmp['Volume'] = float(tmp['Volume'][:-1]) * 1000000000
        else:
            tmp['Volume'] = float(tmp['Volume'])
        top_10.append(tmp)
        count += 1
        if count == 10:
            break
    return top_10

# def scrape_test():
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'gainers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'losers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'gainers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'losers'))

# scrape_test()