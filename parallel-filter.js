const parallelMap = require('./parallel-map');


const parallelFilter = (items, testFn) => {
  const isArray = typeof items.length === 'number';
  const results = isArray ? [] : {};
  return parallelMap(items, testFn).then((testResults) => {
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


module.exports = parallelFilter;
