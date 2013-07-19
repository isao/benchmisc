# readme

Compare the async performance of file-system scanning with dive, scanfs, and wrench.

This exersize uses a shell script to execute node.js scripts (in the runners directory), each in their own process, with node's `--enable-gc` flag. It does this a number of times, and a reporter script can be used to summarize the metrics in tables.

## set up

    git clone <repo>
    cd <repo>
    npm i

## usage

    npm test
    # raw test data tee'd to "report.log"
    
    npm run report
    # parses "report.log" and displays tables with metrics

Or do something like `./run.sh <somepath> | report/tabulate.js`. For example to accumulate several runs at different times in the same data log, `./run.sh <somepath> >> myreportname.log` over and over, then `report/tabulate.js myreportname.log` to get the tallied metrics.

## findings

The tests scanned a small directory (this repo ~1.6k items) and a large one (XCode.app v4.6.3, ~185.2k items). Full results in the `*.txt` files in this repo.

* fastest: dive
* lowest [rss](http://en.wikipedia.org/wiki/Resident_set_size): scanfs
* least heapUsed: dive

## conclusions

