const seriesMap = require('./series-map');


const parallelConcat = (items, worker) => {
  return seriesMap(items, worker).then((results) => {
    results = Object.keys(results).map(p => results[p]);
    return results[0] ? results[0].concat(...results.slice(1)) : results;
  });
};


module.exports = parallelConcat;
