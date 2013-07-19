// https://npmjs.org/package/dive

var dive = require('dive'),
    count = 0;


function fn(err, file) {
    //if (err) console.error(err.code, err.path);
    count++;
}

function main(dir, cb) {
    function done() {
        cb(null, count)
    }

    var opts = {all: true, directories: true};
    dive(dir, opts, fn, done);
}

module.exports = main;
