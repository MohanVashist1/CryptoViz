import json
import os
from pathlib import Path

# os.chdir(Path("..")) # required to run the file from main.py

class CryptoDataReader:
    def __init__(self):
        self.filePath = Path("lib","cryptoData","cryptocurrencies.json") # you can set this manually if you want to change the path
        self._data = None
        if self.filePath.exists():
            with open(self.filePath) as f:
                self._data = json.load(f)
        else:
            print("file does not exist!")
    
    def extract_name(self, ticker):
        if(self._data and ticker in self._data.keys()):
            return self._data[ticker]
        else:
            return None


if __name__ == "__main__":
    #note you will have to manually remove lib from path if you wish to run this below
    print(CryptoDataReader().extract_name("KEY"))
