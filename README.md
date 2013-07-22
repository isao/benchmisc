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

The tests scanned a small directory (this repo ~1.6k items) and a large one (XCode.app v4.6.3, ~185.2k items). Full results in the `*.txt` files in this repo. Apple-to-apples, the results were consistent.

* fastest: dive
* lowest [rss](http://en.wikipedia.org/wiki/Resident_set_size) memory: scanfs

## recommendations

Use `dive` if: you need every file, and/or directory. Optionally skip items beginning with ".". [dive's api](https://git.corp.yahoo.com/isao/benchmisc/blob/master/runners/dive.js) is also clean and well documented.

Use `wrench` if: you need every file, and directory, and want other features like recursive file copying or deletion. `wrench` had the poorest performance, and [it's api](https://git.corp.yahoo.com/isao/benchmisc/blob/master/runners/wrench.js) is a little clumsy. But it chunks result data in per-directory arrays, which might be handy.

Use `scanfs` if: you want control over what things to ignore or classify. You prefer a pub/sub, aka EventEmitter/Stream interface over parameter callbacks.

Although `scanfs` performance was generally second to `dive`'s in an apple-to-apples comparison, it has advantages for other common use-cases. 

* custom control over what you want to ignore (by string or regex). See [these results](https://git.corp.yahoo.com/isao/benchmisc/blob/master/results-morepo.txt) where the mojito git repo was scanned, ignoring `,git` and `node_modules`.
* programatic access to the scanned item fs.stat data via a function parameter.
