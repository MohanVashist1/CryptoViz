import time
import multiprocessing as mp
import DataHandler as dh
import boto3

def retrieve_top_gainers_daily():
    while True:
        dh.retrieve_top_gainers_daily()
        time.sleep(3600)

def retrieve_top_losers_daily():
    while True:
        dh.retrieve_top_losers_daily()
        time.sleep(3600)

def retrieve_top_losers_hourly():
    while True:
        dh.retrieve_top_losers_hourly()
        time.sleep(3600)

def retrieve_top_gainers_hourly():
    while True:
        dh.retrieve_top_gainers_hourly()
        time.sleep(3600)

def crypto_data_minute():
    bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1m", True)
        time.sleep(60)

def crypto_data_five_minutes():
    bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("5m", True)
        time.sleep(300)

def crypto_data_hour():
    bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1h", True)
        time.sleep(3600)

def crypto_data_day():
    bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1d", True)
        time.sleep(86400)

def crypto_data_month():
    bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1M", True)
        time.sleep(2592000)

def schedule_tasks():
    processes = []
    funcs = [retrieve_top_gainers_daily, retrieve_top_losers_daily, retrieve_top_gainers_hourly, retrieve_top_losers_hourly, crypto_data_minute, crypto_data_five_minutes, crypto_data_hour, crypto_data_day, crypto_data_month]
    for func in funcs:
        process = mp.Process(target=func)
        processes.append(process)
        process.start()
    while True:
        time.sleep(180)
        living_processes = [1 for p in processes if p.is_alive()]
        if len(living_processes) < len(funcs):
            for p in living_processes:
                p.terminate()
            print("Oops: Some processes died")

schedule_tasks()
