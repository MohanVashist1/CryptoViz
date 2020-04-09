# Project Title: CryptoViZ
# Team Members: Mohan Vashist (vashistm, 1004260514), Mrigank Mehta (mrigankmg, 1001309014)

## Project Proposal

### Tech Stack

- MongoDB Atlas - NoSQL database used to store and retrieve the latest crypto information, and user login information.
- Python - Creating CLI’s which are used for calculations, and data science processing.
- React - A frontend JS library used to maintain states. Used due to frequent changes in our app page(s).
- Express.js - Node.js web application framework which will be used for routing and middleware purposes.
- Node.js - Used for running, and scheduling CLI.
- Heroku - Used for web app deployment.

### Description

We would like to create an application similar to https://finviz.com/, but focuses on crypto currencies (since finviz has no data on crypto currencies). We will focus on one crypto currency exchange which will be Binance, due to the fact that it is the largest crypto currency exchange (in terms of volume traded per day). Our application will focus on performing technical analysis, specifically, calculating and displaying signals, technical indicators and top gainers/losers.

https://www.investopedia.com/terms/t/trade-signal.asp
https://www.investopedia.com/terms/t/technicalindicator.asp	

### Key Features that will be completed by the Beta version

- Integrating the Binance API to fetch historical and current market data
- Calculating Signals for each cryptocurrencies if they exist
  - Signals that should be channel up, channel down, trendline support and trendline resistance
- Calculate/find top gainers and losers 
- Automatic data retrieval and data processing for all crypto currencies (one trading pair per crypto currency only) listed     in Binance in the background 

### Key features that will be complete by the Final version

- User will be able to save crypto currencies to their watchlist - allowing for users to easily monitor specific crypto currencies 
- Calculating technical indicators
- Technical indicators that will be calculated are RSI, EMA, SMA, Bollinger bands, ADX
- Graphs which are able to display crypto currency price, volume, technical indicators, and signals(if they exists) for         crypto currencies listed on Binance

### Top 5 technical challenges

- Learning React
- Displaying interactive graphs 
- Application deployment
- Integrating python scripts with Node.js.
- Finding efficient ways to concurrently run processes to retrieve and update data 
- Calculating Signals for crypto currencies  

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
    - body: object
      - detail: (string) REGISTER_USER_ALREADY_EXISTS
- response: 422
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
    - body: object
      - detail: (string) LOGIN_BAD_CREDENTIALS
- response: 422
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
    - content-type: `application/json`
    - body: string
      - username=username&password=password
- response: 200
- response: 401
    - body: object
      - detail: (string) Unauthorized

``` 
$ curl -X POST 
       -b cookie.txt
       -c cookie.txt
       localhost:8000/api/users/logout/cookie
```
