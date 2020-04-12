#!/usr/bin/env bash

numCryptos=$(source env/bin/activate && cd lib && python3 ./DataHandler.py 2>&1)
startingValue=0
incrementValue=15

for i in $(seq $startingValue $incrementValue  $numCryptos); do 
    source env/bin/activate && python datarunner.py -k "5m"  -l $i -u $((i+incrementValue)) &>> log5min.txt &
    done

