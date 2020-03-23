import time
import pymongo
import itertools

from fastapi import FastAPI, HTTPException, Path, Query, WebSocket
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import motor.motor_asyncio
from fastapi import FastAPI
from fastapi_users import FastAPIUsers, models
from fastapi_users.authentication import JWTAuthentication, CookieAuthentication
from fastapi_users.db import MongoDBUserDatabase
from starlette.requests import Request
from fastapi import BackgroundTasks
from typing import Optional

from flask import escape
from lib import DataHandler 
from lib import CryptoData
from lib import Scheduler as sc
from threading import Thread


background_tasks_running = False
DATABASE_URL = "mongodb+srv://admin:RERWw4ifyreSYuiG@cryptoviz-f2rwb.azure.mongodb.net/test?retryWrites=true&w=majority"
SECRET = "|X|Th!5iS@S3CR3t|X|"

class User(models.BaseUser):
    watchlist: Optional[list] = []

class UserCreate(User, models.BaseUserCreate):
    watchlist: list

class UserUpdate(User, models.BaseUserUpdate):
    watchlist: Optional[list]

class UserDB(User, models.BaseUserDB):
    watchlist: list

class CryptoRequest(BaseModel):
    ticker: str
    timeInterval: str
    minDate: str
    maxDate: str

app = FastAPI()
# app.add_middleware(HTTPSRedirectMiddleware)
dataHandler = DataHandler.BinanceWrapper()
dataHandler.retrieveCryptoData("BTCUSDT","1w")
cryptoList = dataHandler.getcryptoSymbols()
cryptoData = CryptoData.CryptoDataReader()
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
db = client["cryptoviz"]
users = db["users"]
user_db = MongoDBUserDatabase(UserDB, users)

auth_backends = [
    JWTAuthentication(secret=SECRET, lifetime_seconds=3600),
    CookieAuthentication(secret=SECRET, lifetime_seconds=3600, cookie_name="user_auth", cookie_secure=True, cookie_httponly=True)
]

fastapi_users = FastAPIUsers(
    user_db, auth_backends, User, UserCreate, UserUpdate, UserDB, SECRET,
)
app.include_router(fastapi_users.router, prefix="/api/users", tags=["users"])

# origins = ['*']

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
            if "SameSite=None" not in cookie:
                cookie = cookie + "; SameSite=Strict"
                response.raw_headers[idx] = (header[0], cookie.encode())
    return response

# @app.middleware("http")
# async def set_cors_header(request: Request, call_next):
#     response = await call_next(request)
#     response.raw_headers.append((b'access-control-allow-origin', b'http://localhost:3000'))
#     return response

@app.get("/api/crypto/{ticker}")
async def getCryptoInfo(ticker: str = Path(..., title="The Ticker of the Crypto to get")):
    ticker = escape(ticker)
    if(len(ticker)>5 and len(ticker) < 10 and ticker in cryptoList):
        for tether in dataHandler.tethers:
            tickerTemp = ticker.replace(tether,"")
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

@app.post("/api/crypto/{ticker}")
async def postCryptoData(request: CryptoRequest):
#TODO: Security
    cryptoData = dataHandler.retrieveCryptoData(escape(request.ticker),escape(request.timeInterval))
    cryptoData = cryptoData[(cryptoData['timestamp']>escape(request.minDate)) & (cryptoData['timestamp']<escape(request.maxDate))]
    cryptoData = cryptoData[["timestamp", "close", "rsi","ema","sma","lbb","ubb","mbb"]]
    return {"data": cryptoData.to_json(orient='records')}

@fastapi_users.on_after_register()
def on_after_register(user: User, request: Request):
    print(f"User with email '{user.email}' has registered.")

@fastapi_users.on_after_forgot_password()
def on_after_forgot_password(user: User, token: str, request: Request):
    print(f"User with email '{user.email}' has forgot their password. Reset token: {token}")

# @app.get("/")
# async def root(background_tasks: BackgroundTasks):
#     initiate_background(background_tasks)
#     return {"message": "Hello World"}

@app.get("/api/gainers/")
async def getTopGainers(time: int = 1):
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
async def getTopLosers(time: int = 1):
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
