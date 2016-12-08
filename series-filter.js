const seriesMap = require('./series-map');


const seriesFilter = (items, testFn) => {
  const isArray = typeof items.length === 'number';
  const results = isArray ? [] : {};
  return seriesMap(items, testFn).then((testResults) => {
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


module.exports = seriesFilter;
