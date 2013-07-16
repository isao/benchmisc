#!/bin/sh -e

subjectdir=${1:-'.'}
runners="./dive.js ./scanfs.js ./wrench.js"


run() {
    for r in $runners
    do 
        echo
        echo "$r dir: $subjectdir"
        #time node --expose-gc run.js $r $subjectdir
        node --expose-gc run.js $r $subjectdir
    done
    echo	
}

for i in {0..9}
do
    run
done
