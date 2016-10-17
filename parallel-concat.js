const parallelMap = require('./parallel-map');


const parallelConcat = (items, worker) => {
  return parallelMap(items, worker).then((results) => {
    results = Object.keys(results).map(p => results[p]);
    return results[0].concat(...results.slice(1));
  });
};


module.exports = parallelConcat;
