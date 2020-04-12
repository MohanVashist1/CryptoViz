#!/usr/bin/env bash

numCryptos=$(source env/bin/activate && cd lib && python3 ./DataHandler.py 2>&1)
startingValue=0
incrementValue=5

for i in $(seq $startingValue $incrementValue  $numCryptos); do 
    python datarunner.py -k "1m"  -l $i -u $((i+incrementValue))
    done

