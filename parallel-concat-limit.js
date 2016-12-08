const parallelMapLimit = require('./parallel-map-limit');


const parallelConcat = (items, worker, limit) => {
  return parallelMapLimit(items, worker, limit).then((results) => {
    results = Object.keys(results).map(p => results[p]);
    return results[0] ? results[0].concat(...results.slice(1)) : results;
  });
};


module.exports = parallelConcat;
