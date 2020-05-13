# Project Title: CryptoViZ

#### Team Members: Mohan Vashist, Mrigank Mehta

### Demo Video URL: https://youtu.be/ZdXBcqWCirI

### Tech Stack

- MongoDB Atlas - NoSQL database used to store and retrieve the latest crypto information, and user login information.
- Python - Fetching and processing data to be displayed on the frontend
- React - A frontend JS library used to maintain states. Used due to frequent changes in our app page(s).
- Google Compute Engine

### Description

We created a specialized application to view crypto currency data. Currently you can view data for the Binance exchange, due to the fact that it is the largest crypto currency exchange (in terms of volume traded per day). However, it can easily be modified for other Exchanges. Additionally, our application has integration with the Trading View charting library.

### How to run the application
#### For the backend:
Create a new virtual enviroment 
```
cd backend
python3 -m venv env
source env/bin/activate
```
Install dependencies
```
pip3 install -r requirements.txt
```
Run the backend
```
uvicorn main:app --reload
```

#### How to run the frontend
```
cd frontend/cryptoviz
npm i
npm run dev
```
#### Optional
If you have access to the TradingView Charting Library add the chrating library and datafeed folders from it to src/public, and the charting library to src. Then add the component from https://github.com/tradingview/charting-library-examples/tree/master/react-javascript/src/components/TVChartContainer to src in a directory call components



## REST API Documentation

### Authentication API

#### Create

- description: sign up a new user
- request: `POST /api/users/register`
  - content-type: `application/json`
  - body: object
    - email: (string) email for new user
    - password: (string) password for new user
    - first_name: (string) first name for new user
    - last_name: (string) last name for new user
- response: 201
  - content-type: `application/json`
  - body: object
    - id: (string) id for new user
    - email: (string) email for new user
    - is_active: (boolean) user active status
    - is_superuser: (boolean) is user a superuser
    - watchlist: (list) new user's crypto watchlist
    - first_name: (string) first name for new user
    - last_name: (string) last name for new user
- response: 400
  - content-type: `application/json`
  - body: object
    - detail: (string) REGISTER_USER_ALREADY_EXISTS
- response: 422
  - content-type: `application/json`
  - body: object
    - detail: (list of objects)
      - loc: (string) location of error in request body
      - msg: (string) error message
      - type: (string) error type

```
$ curl -X POST
       -H "accept: application/json"
       -H "Content-Type: application/json"
       -d '{"email":"example@example.com","password":"password","first_name":"example","last_name":"example"}'
       localhost:8000/api/users/register
```

- description: sign in a user
- request: `POST /api/users/login/cookie`
  - content-type: `application/x-www-form-urlencoded`
  - body: string
    - username=username&password=password
- response: 200
- response: 400
  - content-type: `application/json`
  - body: object
    - detail: (string) LOGIN_BAD_CREDENTIALS
- response: 422
  - content-type: `application/json`
  - body: object
    - detail: (list of objects)
      - loc: (string) location of error in request body
      - msg: (string) error message
      - type: (string) error type

```
$ curl -X POST
       -c cookie.txt
       -H "accept: application/json"
       -H "Content-Type: application/x-www-form-urlencoded"
       -d "username=example@example.com&password=password"
       localhost:8000/api/users/login/cookie
```

- description: sign out a user
- request: `POST /api/users/logout/cookie`
- response: 200
- response: 401
  - content-type: `application/json`
  - body: object
    - detail: (string) Unauthorized

```
$ curl -X POST
       -b cookie.txt
       -c cookie.txt
       localhost:8000/api/users/logout/cookie
```

#### Read

- description: get logged in user information
- request: `GET /api/users/me`
- response: 200
  - content-type: `application/json`
  - body: object
    - id: (string) id for logged in user
    - email: (string) email for logged in user
    - is_active: (boolean) logged in user active status
    - is_superuser: (boolean) is logged in user a superuser
    - watchlist: (list) logged in user's crypto watchlist
    - first_name: (string) first name for logged in user
    - last_name: (string) last name for logged in user
- response: 401
  - content-type: `application/json`
  - body: object
    - detail: (string) Unauthorized

```
$ curl -b cookie.txt
       localhost:8000/api/users/me/
```

#### Update

- description: update logged in user
- request: `PATCH /api/users/me`
  - content-type: `application/json`
  - body: object
    - id: (string) new id for logged in user
    - email: (string) new email for logged in user
    - is_active: (boolean) logged in user new active status
    - is_superuser: (boolean) logged in user new superuser status
    - watchlist: (list) logged in user's new crypto watchlist
    - first_name: (string) new first name for logged in user
    - last_name: (string) new last name for logged in user
- response: 200
  - body: object
    - id: (string) id for new user
    - email: (string) email for new user
    - is_active: (boolean) user active status
    - is_superuser: (boolean) is user a superuser
    - watchlist: (list) new user's crypto watchlist
    - first_name: (string) first name for new user
    - last_name: (string) last name for new user
- response: 401
  - content-type: `application/json`
  - body: object
    - detail: (string) Unauthorized
- response: 422
  - content-type: `application/json`
  - body: object
    - detail: (list of objects)
      - loc: (string) location of error in request body
      - msg: (string) error message
      - type: (string) error type

```
$ curl -X PATCH
       -H "Content-Type: application/json"
       -b cookie.txt
       -d '{"first_name": "example"}'
       localhost:8000/api/users/me/
```

### Crypto API

#### Read

- description: get top (max 10) gainers
- request: `GET /api/gainers/[?time=1]`
- response: 200
  - content-type: `application/json`
  - body: (object)
    - gainers: (list of objects)
      - symbol: crypto symbol
      - rank: crypto rank
      - market_cap: market cap of crypto
      - price: price of crypto
      - volume: crypto volume
      - percent: crypto gain percentage
- response: 400
  - content-type: `application/json`
  - body: Invalid time.
- response: 422
  - content-type: `application/json`
  - body: object
    - detail: (list of objects)
      - loc: (string) location of error in request body
      - msg: (string) error message
      - type: (string) error type

```
$ curl -H "Content-Type: application/json"
       localhost:8000/api/gainers/
```

- description: get top (max 10) losers
- request: `GET /api/losers/[?time=1]`
- response: 200
  - content-type: `application/json`
  - body: (object)
    - gainers: (list of objects)
      - symbol: crypto symbol
      - rank: crypto rank
      - market_cap: market cap of crypto
      - price: price of crypto
      - volume: crypto volume
      - percent: crypto loss percentage
- response: 400
  - content-type: `application/json`
  - body: Invalid time.
- response: 422
  - content-type: `application/json`
  - body: object
    - detail: (list of objects)
      - loc: (string) location of error in request body
      - msg: (string) error message
      - type: (string) error type

```
$ curl -H "Content-Type: application/json"
       localhost:8000/api/losers/
```

- description: get top (max 10) losers
- request: `GET /api/crypto/tickerInfo/{ticker}`
  - path parameter: ticker
    - The ticker of the crypto currency you would like to retrieve more info from
- response: 200
  - content-type: `application/json`
  - body: (object)
    - fullName: full name of the crypto currency (e.g for /api/crypto/tickerInfo/BTCUSDT, fullName would be Bitcoin)
- response: 404
  - content-type: `application/json`
  - detail: "Ticker not found"

```
curl --location --request GET 'localhost:8000/api/crypto/tickerInfo/BTCUSDT'
```

- description: retrieve current UTC time
- request: `GET /time`
- response: 200
  - content-type: `text/plain`
  - body: (str)
    - currentUTCTime

```
curl --location --request GET 'localhost:8000/time'
```

- description: retrieve timestamp and closing price for a crypto currency over a date range
- request: `GET /api/crypto/data/{ticker}`
- pathParameters:
  - ticker: crypto currency to retrieve closing price + timestamp for
- parameters:
  - timeInterval: (default 1d, str), size of candlesticks to retrieve
  - minDate: (str), receive closing price with it's associated time stamp starting at this point, must follow format: YYYY-mm-dd HH:MM:SS
  - maxDate: (str), receive closing price with it's associated time stamp starting up to this point, must follow format: YYYY-mm-dd HH:MM:SS
- response 200:
  - content-type: `application/json`
  - body: (obj)
    - data: (str) a list which contains a objects at each position containing the associated timestamp and price
- response 400:
  - content-type: `application/json`
    - detail: Malformed payload request (when one or more of the parameters is missing)

```
curl --location --request GET 'http://localhost:8000/api/crypto/data/BTCUSDT?minDate=2020-03-12%21:12:31&maxDate=2020-04-12%21:12:31&timeInterval=1d'
```

- description: retrieve more details about what data the server is able to send
- request: `GET /config`
- response: 200
  - content-type: `application/json`
  - body: (obj)
    - exchanges: (list) A list of objects, each contains the value name and description of the exchange
    - symbols_types: (list) A list of objects, each contains the value and name of the security that can be retrieved
    - supported_resolutions: (list) list of strings that represent which candle stick sizes are supported
    - supports_search: (bool) default true
    - supports_group_request: (bool) default false
    - supports_marks: (bool) default false
    - supports_timescale_marks: (bool) default false
    - supports_time: (bool) default true

```
curl --location --request GET 'http://localhost:8000/config'
```

- description: retrieve additional info about the crypto currency
- request: `GET /symbols`
- parameters:
  - symbol: (default BTCUSDT, str), ticker/symbol of the security to receive more info for
- response 200:
  - content-type: `application/json`
  - body: (obj)
    - symbol: (str) the symbol of the requested security
    - ticker: (str) the ticker of the requested security
    - ticker: (str) the name of the requested security
    - full_name: (str) the full name/common name of the requested security
    - description: (str) symbol of the security(without tether) followed by a '/' followed by the tether
    - exchange: (str) exchange that the security is listed on
    - listed_exchange: (str) exchange that the security is listed on
    - type: (str) type of security
    - currency_code: (str) the currency code of the requested security
    - session: (str) when is the security available for trading
    - timezone: (str) what timezone is the security traded in
    - minmovement: (str) minimum price movement
    - minmov: (str) minimum price movement
    - minmovement2: (str) secondary minimum price movement
    - minmov2: (str) secondary minimum price movement
    - pricescale: (int) 10^(pricescale) shows how many decimals to display
    - supported_resolutions: supported time intervals
    - has_intraday: (boolean) has intraday data
    - has_daily: (boolean) has daily data
    - has_weekly_and_monthly: (boolean) has weekly and monthly data
    - data_status: (str) if the backend is currently able to supply data for this security
- response 404:
  - content-type: `application/json`
    - detail: "Symbol Not Found"

```
curl --location --request GET 'http://localhost:8000/symbols?symbol=ETHUSDT'
```

- description: retrieve a list of valid crypto currencies
- request: `GET /symbol_info`
- response: 200
  - content-type: `application/json`
  - body: (obj)
    - returns a list of strings which are the tickers of the crypto currencies supported by the server

```
curl --location --request GET 'http://localhost:8000/symbol_info''
```

- description: search for a crypto
- request: `GET /search`
- parameters:
  - query: (str), the query string to match to other cryptos
  - limit: (int, default 10), number of results to return
- response: 200
  - content-type: `application/json`
  - body: (obj)
    - list of objects which match the query, each object is the same as the one returned in /symbols

```
curl --location --request GET 'http://localhost:8000/search?query=btc'
```

- description: retrieve timestamp(in epoch format), closing price, high price, open price, volume and low price for a crypto currency over a date range and candle stick size
- request: `GET /history`
- Parameters:
  - symbol: (str) crypto currency to retrieve data for
  - resolution: (str) candle stick size
  - to: (str) epoch time to begin retrieving data
  - from: (str) epoch time stop retrieving data
- response 200:
  - content-type: `application/json`
  - body: (obj)
    - s: (str) status (will be "ok")
    - t: (list) all timestamps in epoch format
    - h: (list) all high prices
    - l: (list) all low prices
    - c: (list) all closing prices
    - o: (list) all opening prices
    - v: (list) all volume levels
- response 400:
  - content-type: `application/json`
    - detail: invalid request (if any parameters are incorrect)

```
curl --location --request GET 'http://localhost:8000/history?from=1585967439&to=1585978239&symbol=BTCUSDT&resolution=1'
```
