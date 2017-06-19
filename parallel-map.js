const parallel = require('./parallel');


const parallelMap = (items, fn) => {
  const tasks = typeof items === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = () => fn(items[prop], prop, items);
  }
  return parallel(tasks);
};


module.exports = parallelMap;
