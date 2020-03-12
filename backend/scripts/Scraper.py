import requests
from bs4 import BeautifulSoup
import pandas as pd

ranks = []
symbols = []
market_caps = []
prices = []
volumes = []
page = requests.get('https://bitscreener.com/screener/gainers-losers')

soup = BeautifulSoup(page.content, 'html.parser')
count = 0
for gainer in soup.find(id='gainers').find('tbody').find_all('tr'):
    gainer_info = gainer.find_all('td')
    ranks.append(gainer_info[0].find('a').text)
    symbols.append(gainer_info[1].find('a').text)
    market_caps.append(gainer_info[2].find('a').text)
    prices.append(gainer_info[3].find('a').text)
    volumes.append(gainer_info[4].find('a').text)
    count += 1
    if count == 10:
        break

df = pd.DataFrame({'Rank': ranks, 'Symbol': symbols, 'Market Cap': market_caps, 'Price': prices, 'Volume': volumes}) 
df.to_csv('gainers.csv', index=False, encoding='utf-8')

ranks = []
symbols = []
market_caps = []
prices = []
volumes = []
count = 0
for loser in soup.find(id='losers').find('tbody').find_all('tr'):
    loser_info = loser.find_all('td')
    ranks.append(loser_info[0].find('a').text)
    symbols.append(loser_info[1].find('a').text)
    market_caps.append(loser_info[2].find('a').text)
    prices.append(loser_info[3].find('a').text)
    volumes.append(loser_info[4].find('a').text)
    count += 1
    if count == 10:
        break

df = pd.DataFrame({'Rank': ranks, 'Symbol': symbols, 'Market Cap': market_caps, 'Price': prices, 'Volume': volumes}) 
df.to_csv('losers.csv', index=False, encoding='utf-8')