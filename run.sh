#!/bin/sh -e

# normalize path to this file's parent directory
dir=$(cd $(dirname $0) && pwd)

# 1st argument is directory to walk/scan, defaults to this dir
subjectdir=${1:-$dir}

# values correspond to js scripts in ./runners
runners='dive scanfs scanfs-ignoregit wrench'

run() {
    for r in $runners
    do
        echo
        echo "$r dir: $subjectdir"
        #time node --expose-gc run.js $r $subjectdir
        node --expose-gc $dir/run.js $r $subjectdir
    done
    echo
}

for i in {0..9}
do
    run
done
