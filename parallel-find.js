const parallelMap = require('./parallel-map');
const exec        = require('./exec');


const parallelFind = (items, tester) => {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const promises = Object.keys(items).map(p => {
      return exec(() => tester(items[p])).then(ok => {
        if (ok) {
          resolved = true;
          resolve(items[p]);
        }
      }, reject);
    });

    Promise.all(promises).then(() => {
      if (!resolved) { resolve(); }
    });
  });
};


module.exports = parallelFind;
