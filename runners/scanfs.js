// https://npmjs.org/package/scanfs

var Scan = require('scanfs');


function onerr(err) {
	//console.log(err.code, err.path);
}

function main(dir, cb) {
    var scan = new Scan();
    scan.on('error', onerr);
    scan.on('done', cb);
    scan.relatively(dir);
}

module.exports = main;
