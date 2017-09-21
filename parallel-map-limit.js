const parallelLimit = require('./parallel-limit');


const parallelMapLimit = (items, fn, limit) => {
  const tasks = typeof items.length === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = () => fn(items[prop], prop, items);
  }
  return parallelLimit(tasks, limit);
};


module.exports = parallelMapLimit;
