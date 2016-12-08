const parallelMapLimit = require('./parallel-map-limit');


const parallelFilterLimit = (items, testFn, limit) => {
  const isArray = typeof items.length === 'number';
  const results = isArray ? [] : {};
  return parallelMapLimit(items, testFn, limit).then((testResults) => {
    for (const prop in testResults) {
      if (testResults[prop]) {
        if (isArray) {
          results.push(items[prop]);
        } else {
          results[prop] = items[prop];
        }
      }
    }
    return results;
  });
};


module.exports = parallelFilterLimit;
