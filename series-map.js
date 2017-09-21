const series = require('./series');


const seriesMap = (items, fn) => {
  const tasks = typeof items.length === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = () => fn(items[prop], prop, items);
  }
  return series(tasks);
};


module.exports = seriesMap;
