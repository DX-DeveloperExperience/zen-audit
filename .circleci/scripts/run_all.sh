#!/bin/bash

for script in $(ls `dirname "$0"`/)
do
    [ "$script" != "run_all.sh" ] && $script
done
