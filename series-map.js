const series = require('./series');


const seriesMap = (items, fn) => {
  const tasks = typeof items === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = () => fn(items[prop]);
  }
  return series(tasks);
};


module.exports = seriesMap;
