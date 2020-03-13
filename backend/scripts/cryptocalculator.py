import json
import json
import requests
from pyti.exponential_moving_average import exponential_moving_average as ema
from pyti.simple_moving_average import simple_moving_average as sma
from pyti.relative_strength_index import relative_strength_index as rsi
from pyti.bollinger_bands import upper_bollinger_band as ubb
from pyti.bollinger_bands import middle_bollinger_band as mbb
from pyti.bollinger_bands import lower_bollinger_band as lbb
import pandas as pd


class CryptoCalculator:

    def ema(self, df):
        data = ema(df, 9)
        return(data)
    
    def sma(self, df):
        data = sma(df,15)
        return(data)
    
    def rsi(self, df):
        data = rsi(df, 14)
        return(data)

    def ubb(self, df):
        data = ubb(df,20)
        return(data)
    
    def mbb(self, df):
        data = mbb(df,20)
        return(data)

    def lbb(self, df):
        data = lbb(df,20)
        return(data)
