#!/usr/bin/env bash

source env/bin/activate && python datarunner.py -k "1w"  -l -1 -u -1 &>> log1w.txt &