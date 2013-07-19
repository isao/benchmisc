// https://npmjs.org/package/wrench

var wrench = require('wrench'),
    count = 0;


function main(dir, cb) {
    function fn(err, list) {
        //if (err) throw err;
        if (list) {
            count += list.length
            
        } else if (null === list) {
            cb(null, count);
        }
    }

    wrench.readdirRecursive(dir, fn);
}

module.exports = main;
