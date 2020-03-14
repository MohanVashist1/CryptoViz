import time
import multiprocessing as mp
import DataHandler as dh

bw = None

def global_binance_wrapper():
    global bw
    if not bw:
        bw = dh.BinanceWrapper()
    return bw

def retrieve_top_gainers_daily():
    while True:
        print("here")
        dh.retrieve_top_gainers_daily()
        time.sleep(6)

def retrieve_top_losers_daily():
    while True:
        print("here")
        dh.retrieve_top_losers_daily()
        time.sleep(6)

def retrieve_top_losers_hourly():
    while True:
        print("here")
        dh.retrieve_top_losers_hourly()
        time.sleep(6)

def retrieve_top_gainers_hourly():
    while True:
        print("here")
        dh.retrieve_top_gainers_hourly()
        time.sleep(6)

def crypto_data_minute():
    # bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1m", True)
        time.sleep(60)

def crypto_data_five_minutes():
    # bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("5m", True)
        time.sleep(300)

def crypto_data_hour():
    # bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1h", True)
        time.sleep(3600)

def crypto_data_day():
    # bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1d", True)
        time.sleep(86400)

def crypto_data_month():
    # bw = dh.BinanceWrapper()
    while True:
        bw.getAllCryptoDataBinance("1M", True)
        time.sleep(2592000)

def test(f_name):
    if f_name == 'top_gainers_daily':
        retrieve_top_gainers_daily()
    elif f_name == 'top_losers_daily':
        retrieve_top_losers_daily()
    elif f_name == 'top_gainers_hourly':
        retrieve_top_gainers_hourly()
    elif f_name == 'top_losers_hourly':
        retrieve_top_losers_hourly()
    elif f_name == 'data_minute':
        crypto_data_minute()
    elif f_name == 'data_five_minutes':
        crypto_data_five_minutes()
    elif f_name == 'data_hour':
        crypto_data_hour()
    elif f_name == 'data_day':
        crypto_data_day()
    elif f_name == 'data_month':
        crypto_data_month()

def schedule_tasks():
    #processes = []
    #funcs = [retrieve_top_gainers_daily, retrieve_top_losers_daily, retrieve_top_gainers_hourly, retrieve_top_losers_hourly, crypto_data_minute, crypto_data_five_minutes, crypto_data_hour, crypto_data_day, crypto_data_month]
    funcs = ['top_gainers_daily', 'top_losers_daily', 'top_gainers_hourly', 'top_losers_hourly', 'data_minute', 'data_five_minutes', 'data_hour', 'data_day', 'data_month']
    with mp.Pool(processes=mp.cpu_count(), initializer=global_binance_wrapper) as pool:
        pool.map(test, funcs)
        pool.close()
        pool.join()
    # for func in funcs:
    #     process = mp.Process(target=func)
    #     processes.append(process)
    #     process.start()
    # while True:
    #     time.sleep(180)
    #     living_processes = [p for p in processes if p.is_alive()]
    #     if len(living_processes) < len(funcs):
    #         for p in living_processes:
    #             p.terminate()
            # print("Oops: Some processes died")

schedule_tasks()
