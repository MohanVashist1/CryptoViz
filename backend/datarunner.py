# import click
import fcntl
import sys
import os

import click

from lib import DataHandler


@click.command()
@click.option('--kline', '-k', required=True, type=str)
@click.option('--lowerLimit', '-l', 'lowerLimit', type=int, default=-1, required=True)
@click.option('--upperLimit', '-u', 'upperLimit', type=int, default=-1, required=True)
def main(kline, lowerLimit, upperLimit):
    click.echo("kline size: {}, lowerLimit: {}, upperLimit: {}".format(
        kline, lowerLimit, upperLimit))
    datahandler = DataHandler.BinanceWrapper()
    pid_file = 'datarunner_{}_{}_{}.pid'.format(kline, lowerLimit, upperLimit)
    fp = open(pid_file, 'w')
    try:
        fcntl.lockf(fp, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        # another instance is running
        click.echo("already running")
        sys.exit(1)
    numCryptos = len(datahandler.getcryptoSymbols(tether="USDT"))
    if(upperLimit != -1 and lowerLimit != -1):
        if(lowerLimit >= 0 and lowerLimit < upperLimit):
            if(upperLimit > numCryptos):
                upperLimit = numCryptos
            datahandler.updateLimitedCryptoData(
                kline_size=kline, upperLimit=upperLimit, lowerLimit=lowerLimit)
        else:
            click.echo("Invalid upper and lower limits")
    else:
        datahandler.getAllCryptoDataBinance(kline_size=kline, save=True)
    os.remove(pid_file)


if __name__ == "__main__":
    main()
