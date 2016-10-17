const series = require('./series');


const seriesMap = (items, fn) => {
  for (const prop in items) {
    const item = items[prop];
    items[prop] = () => fn(item);
  }
  return series(items);
};


module.exports = seriesMap;
