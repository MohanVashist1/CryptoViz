import time
import pymongo
import pydantic
import math

from fastapi import FastAPI, HTTPException, Path, Query, WebSocket, Depends, Response, Request
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import motor.motor_asyncio
from fastapi import FastAPI
from fastapi_users import FastAPIUsers, models
from fastapi_users.authentication import CookieAuthentication
from fastapi_users.db import MongoDBUserDatabase
from starlette.requests import Request
from fastapi import BackgroundTasks
from typing import Optional
from fastapi.staticfiles import StaticFiles
from calendar import timegm

from flask import escape
from lib import DataHandler
from lib import CryptoData
from lib import Scheduler as sc
from threading import Thread
from pydantic import EmailStr

background_tasks_running = False
DATABASE_URL = "mongodb+srv://admin:RERWw4ifyreSYuiG@cryptoviz-f2rwb.azure.mongodb.net/test?retryWrites=true&w=majority"
SECRET = "|X|Th!5iS@S3CR3t|X|"


class User(models.BaseUser):
    watchlist: Optional[list] = []
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(User, models.BaseUserCreate):
    email: EmailStr
    first_name: str
    last_name: str
    watchlist: Optional[list] = []


class UserUpdate(User, models.BaseUserUpdate):
    watchlist: Optional[list]
    first_name: Optional[str]
    last_name: Optional[str]


class UserDB(User, models.BaseUserDB):
    pass


class CryptoRequest(BaseModel):
    ticker: str
    timeInterval: str
    minDate: str
    maxDate: str


app = FastAPI()
# app.mount("/static", StaticFiles(directory="./../frontend/cryptoviz/public"), name="static")
# app.add_middleware(HTTPSRedirectMiddleware)
dataHandler = DataHandler.BinanceWrapper()
tempCryptoList = dataHandler.getcryptoSymbols()
cryptoList = []
for symbol in tempCryptoList:
    for tether in dataHandler.tethers:
        if(tether in symbol and symbol not in cryptoList):
            cryptoList.append(symbol)
cryptoData = CryptoData.CryptoDataReader()
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
db = client["cryptoviz"]
users = db["users"]
user_db = MongoDBUserDatabase(UserDB, users)

auth_backends = [
    CookieAuthentication(secret=SECRET, lifetime_seconds=3600 * 24,
                         cookie_name="user_auth", cookie_secure=False, cookie_httponly=True)
]

fastapi_users = FastAPIUsers(
    user_db, auth_backends, User, UserCreate, UserUpdate, UserDB, SECRET,
)
app.include_router(fastapi_users.router, prefix="/api/users", tags=["users"])

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# background_thread = Thread(target=sc.schedule_tasks)
# background_thread.start()

#********************************************************************************************
 #    Title: Setting SameSite flag manually when using response.set_cookie()
 #    Author: zero-shubham
 #    Date: March 8, 2020
 #    Availability: https://github.com/tiangolo/fastapi/issues/1099
 #*******************************************************************************************/
@app.middleware("http")
async def cookie_set(request: Request, call_next):
    response = await call_next(request)
    for idx, header in enumerate(response.raw_headers):
        if header[0].decode("utf-8") == "set-cookie":
            cookie = header[1].decode("utf-8")
            if "SameSite=Strict" not in cookie:
                cookie = cookie + "; SameSite=Strict"
                response.raw_headers[idx] = (header[0], cookie.encode())
    return response

# @app.middleware("http")
# async def set_cors_header(request: Request, call_next):
#     response = await call_next(request)
#     response.raw_headers.append((b'access-control-allow-origin', b'http://localhost:3000'))
#     return response


@app.get("/api/crypto/tickerInfo/{ticker}")
async def get_crypto_info(ticker: str = Path(..., title="The Ticker of the Crypto to get")):
    ticker = escape(ticker)
    if(len(ticker) > 5 and len(ticker) < 10 and ticker in cryptoList):
        for tether in dataHandler.tethers:
            tickerTemp = ticker.replace(tether, "")
            fullName = cryptoData.extract_name(tickerTemp)
            if(fullName):
                return {"fullName": fullName}
    raise HTTPException(status_code=404, detail="Ticker not found")

# @app.websocket("/api/crypto/")
# async def websocket_crypto_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     defaultIntervals = dataHandler.klines
#     cryptoData = None
#     # cryptoData = dataHandler.retrieveCryptoData(ticker,timeInterval)
#     # cryptoData = cryptoData[(cryptoData['timestamp']>"2020-03-15 02:37:00") & (cryptoData['timestamp']<"2020-03-15 02:41:00")]
#     # cryptoData = cryptoData[["timestamp", "close", "rsi","ema","sma","lbb","ubb","mbb"]]
#     while True:
#         # data = data["2020-03-05":"2020-03-14"]
#         # print(data
#         data = await websocket.receive_json()
#         print("data is ", data)
#         if(data["action"] == 'Update'):
#             if("minDate" in data.keys() and "maxDate" in data.keys() and "timeInterval" in data.keys() and escape(data['timeInterval']) in defaultIntervals and "ticker" in data.keys() and escape(data['ticker']) in cryptoList ):
#                 mindate = escape(data["minDate"])
#                 maxDate = escape(data["maxDate"])
#                 ticker = escape(data['ticker'])
#                 timeInterval = escape(data['timeInterval'])
#                 cryptoData = dataHandler.retrieveCryptoData(ticker,timeInterval)
#                 cryptoData = cryptoData[(cryptoData['timestamp']>mindate) & (cryptoData['timestamp']<maxDate)]
#                 cryptoData = cryptoData[["timestamp", "close", "rsi","ema","sma","lbb","ubb","mbb"]]
#                 await websocket.send_json(cryptoData.to_json(orient='records'))
#             else:
#                 await websocket.close(code=1000)


@app.get("/api/crypto/data/{ticker}")
async def post_crypto_data(ticker: str = Path(..., title="The Ticker of the Crypto to get"), timeInterval: str = "1d", minDate: str = " ", maxDate: str = " "):
    # TODO: Security and checking if exist
    cryptoData = dataHandler.retrieveCryptoData(
        escape(ticker), escape(timeInterval))
    cryptoData = cryptoData[(cryptoData['timestamp'] > escape(minDate)) & (
        cryptoData['timestamp'] < escape(maxDate))]
    cryptoData = cryptoData[["timestamp", "close"]]
    return {"data": cryptoData.to_json(orient='records')}


@fastapi_users.on_after_register()
def on_after_register(user: User, request: Request):
    print(f"User with email '{user.email}' has registered.")


@fastapi_users.on_after_forgot_password()
def on_after_forgot_password(user: User, token: str, request: Request):
    print(
        f"User with email '{user.email}' has forgot their password. Reset token: {token}")


@app.get("/api/gainers/")
async def get_top_gainers(time: int = 1):
    if time != 1 and time != 24:
        raise HTTPException(status_code=400, detail="Invalid time.")
    # collection = None
    # if time == 1:
    #     collection = db["top_gainers_hourly"]
    # else:
    #     collection = db["top_gainers_daily"]
    # res = []
    # for document in await collection.find({}, {'_id': 0}).to_list(length=100):
    #     res.append(document)
    res = None
    if time == 1:
        res = DataHandler.retrieve_top_gainers_hourly()
    else:
        res = DataHandler.retrieve_top_gainers_daily()
    return {"gainers": res}


@app.get("/api/losers/")
async def get_top_losers(time: int = 1):
    if time != 1 and time != 24:
        raise HTTPException(status_code=400, detail="Invalid time.")
    # collection = None
    # if time == 1:
    #     collection = db["top_losers_hourly"]
    # else:
    #     collection = db["top_losers_daily"]
    # res = []
    # for document in await collection.find({}, {'_id': 0}).to_list(length=100):
    #     res.append(document)
    res = None
    if time == 1:
        res = DataHandler.retrieve_top_losers_hourly()
    else:
        res = DataHandler.retrieve_top_losers_daily()
    return {"losers": res}


@app.get("/time")
async def currTime(response: Response):
    response.headers['Content-Type'] = 'text/plain'
    return (int(time.time()))


@app.get("/config")
async def getConfig(response: Response):
    return dataHandler.config()


@app.get("/symbol_info")
async def retriveAllSymbols():
    return cryptoList


@app.get("/symbols")
async def crypto_info(symbol: str = "BTCUSDT"):
    symbol = escape(symbol)
    if(len(symbol) > 10):
        symbol = symbol[:9]
    if(symbol not in cryptoList):
        raise HTTPException(status_code=404, detail="Symbol Not Found")
        return
    symbolName = None
    for tether in dataHandler.tethers:
        tickerTemp = symbol.replace(tether, "")
        fullName = cryptoData.extract_name(tickerTemp)
        if(fullName):
            symbolName = fullName
            break
    return dataHandler.symbolsInfo(symbol, symbolName=symbolName)


@app.get("/search")
async def search_for_symbol(query: str = None, limit: int = 10):
    if(not query and limit < len(cryptoList)):
        return cryptoList[:limit]
    elif(query is not None and len(query) < 15):
        query = escape(query)
        query = query.upper()
        tempQueryList = [s for s in cryptoList if query in s][:limit]
        queryList = []
        for symbol in tempQueryList:
            symbolName = None
            for tether in dataHandler.tethers:
                tickerTemp = symbol.replace(tether, "")
                fullName = cryptoData.extract_name(tickerTemp)
                if(fullName):
                    symbolName = fullName
                    queryList.append(dataHandler.symbolsInfo(
                        symbol, symbolName=symbolName))
        return queryList
    else:
        raise HTTPException(status_code=400, detail="Invalid request")


@app.get("/history")
async def history(request: Request, symbol: str = " ", to: int = 0, resolution: str = " "):
    if(symbol not in cryptoList or 'from' not in request.query_params or not to):
        raise HTTPException(status_code=400, detail="Invalid request")
    fromDate = int(escape(request.query_params['from']))
    to = int(escape(to))
    symbol = escape(symbol)
    resolution = escape(resolution)
    returnVal = dataHandler.history(
        to=to, fromDate=fromDate, symbol=symbol, resolution=resolution)
    if(not returnVal.empty):
        tTemp = (returnVal["timestamp"].values)
        t = []
        for currTime in tTemp:
            if ":" in currTime:
                t.append(timegm(time.strptime(currTime, "%Y-%m-%d %H:%M:%S")))
            else:
                t.append(timegm(time.strptime(
                    currTime.strip(), "%Y-%m-%d")))
        return {"s": "ok", "t": t, "o": list(returnVal["open"].values),
                "c": list(returnVal["close"].values), "v": list(returnVal["volume"].values), 'h': list(returnVal["high"].values), 'l': list(returnVal["low"].values)}
    else:
        raise HTTPException(status_code=400, detail="Invalid request")

    # def initiate_background(background_tasks):
    #     global background_tasks_running
    #     if not background_tasks_running:
    #         background_tasks_running = True
    #         background_tasks.add_task(sc.schedule_tasks)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "1m", True)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "5m", True)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "1h", True)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "1d", True)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "1w", True)
    #         background_tasks.add_task(dataHandler.getAllCryptoDataBinance, "1M", True)

    # @app.get('/protected-route')
    # def protected_route(user: User = Depends(fastapi_users.get_current_user)):
    #     return f'Hello, {user.email}'
