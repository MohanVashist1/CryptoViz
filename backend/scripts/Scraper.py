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
        tmp['Market Cap'] = normalize_val(info[2].find('a').text)
        tmp['Price'] = normalize_val(info[3].find('a').text)
        tmp['Volume'] = normalize_val(info[4].find('a').text)
        top_10.append(tmp)
        count += 1
        if count == 10:
            break
    return top_10

def normalize_val(val):
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

# def scrape_test():
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'gainers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=1h#gainers', 'losers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'gainers'))
#     print(scrape('https://bitscreener.com/screener/gainers-losers?tf=24h#gainers', 'losers'))

# scrape_test()