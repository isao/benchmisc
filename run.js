//https://gist.github.com/isaacs/5733238
//$ node --expose-gc this-script.js express

var m0,
    m1,
    mdelta = {},

    t0,
    tdelta,
    module = process.argv[2],
    dir = process.argv[3],
    i;

gc();
console.time(module + ' time');
m0 = process.memoryUsage();
t0 = process.hrtime();

require('./runners/' + module)(dir, function(err, count) {

    tdelta = process.hrtime(t0);
    console.timeEnd(module + ' time');
	console.log(module, 'items:', count);
    gc();

    m1 = process.memoryUsage();
    for (i in m0) {
        mdelta[i] = m1[i] - m0[i];
    }

    console.log('%s process.hrtime: %d nanoseconds', module, tdelta[0] * 1e9 + tdelta[1]);
    console.log(module, 'rss:', mdelta.rss);
    console.log(module, 'heapTotal:', mdelta.heapTotal);
    console.log(module, 'heapUsed:', mdelta.heapUsed);
});
