#!/usr/bin/env node

var fs = require('fs'),
    Table = require('cli-table'),
    liner = require('./liner'),

    skip = {items:null, time:null},
    data = {},
    sums = {},

    // input is a pathname from argv, or stdin
    input = process.argv[2] ?
        fs.createReadStream(process.argv[2]) : process.stdin;


// parse lines from file or stdin like:
//    <src> <metric/type> <number> <...ignored>
// ...into data/sums objects like {src:{type:<sum|array>}}
// blank lines, and lines without integers in the 3rd column are ignored
function parse() {
     var line, col, src, type, num;

     while (line = liner.read()) {
        col = line.split(/:?\s+/),
        src = col[0],
        type = col[1],
        num = (col[2] != null) && parseInt(col[2], 10);

        if (!skip.hasOwnProperty(type) && (num === num)) {

            if (!data[src]) {
                data[src] = {};
                sums[src] = {};
            }

            if (!data[src][type]) {
                data[src][type] = [];
                sums[src][type] = 0;
            }

            data[src][type].push(num);
            sums[src][type] += num;
        }
    }
}

// make a table for each metric/type showing src, average, % worse than minimum
function report() {
    var srcs = Object.keys(data),
        types = Object.keys(data[srcs[0]]);

    types.forEach(function(type) {
        var opts = {
                head: ['src', type, 'worse by'],
                colAligns: ['left', 'right', 'right']
            },
            table = new Table(opts),
            row = [],
            min = Infinity;

        // get averages
        srcs.forEach(function(src) {
            var average = Math.round(sums[src][type] / data[src][type].length);
            min = Math.min(min, average);
            table.push([src, average]);
        });

        // append % worse compared to min, onto each row
        table.forEach(function(row, i) {
            var percent = (row[1] - min) / row[1];
            row.push(Math.round(percent * 100) + '%');
        });

        console.log(table.toString());
    });
}

liner.on('readable', parse);
liner.on('end', report);
input.pipe(liner);

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
