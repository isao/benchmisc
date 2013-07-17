var fs = require('fs'),
    Table = require('cli-table'),
    liner = require('./liner'),
    data = {},
    sums = {};


function parse() {
     var line, col;

     while (line = liner.read()) {
        col = line.split(/:?\s+/),
        src = col[0],
        type = col[1],
        num = parseInt(col[2]);

        if (!data[src]) {
            data[src] = {};
            sums[src] = {};
        }

        if (('items' !== type) && (num > 0)) {
            if (!data[src][type]) {
                data[src][type] = [];
                sums[src][type] = 0;
            }
            data[src][type].push(num);
            sums[src][type] += num;
        }
    }
}

function report() {
    var srcs = Object.keys(data),
        table;

    srcs.forEach(function(src) {
        var types = Object.keys(data[src]),
            row = [src];

        if (!table) {
            table = new Table({head:['src'].concat(types)});
        }

        types.forEach(function(type) {
            row.push(Math.round(sums[src][type] / data[src][type].length));
        });

        table.push(row);
    });


    console.log(table.toString());
}

liner.on('readable', parse);
liner.on('end', report);
fs.createReadStream(process.argv[2]).pipe(liner)



/*

raw data looks like

    ./dive.js dir: .
    ./dive.js time: 11ms
    ./dive.js items: 201
    ./dive.js process.hrtime: 9937347 nanoseconds
    ./dive.js rss: 1396736
    ./dive.js heapTotal: 1396736
    ./dive.js heapUsed: 1396736

    ./scanfs.js dir: .
    ./scanfs.js time: 20ms
    ...

parsed data object looks like

    { './dive.js': {
        'process.hrtime': [ 9937347, ...],
         rss: [ 1396736, ...],
         heapTotal: [ 1396736, ...],
         heapUsed: [ 1396736, ...] },
      './scanfs.js': {
         'process.hrtime': [ 19618604, ...],
         rss: [ 1396736, ...],
         ...

*/
