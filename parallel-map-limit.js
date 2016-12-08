const parallelLimit = require('./parallel-limit');


const parallelMapLimit = (items, fn, limit) => {
  const tasks = typeof items === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = () => fn(items[prop]);
  }
  return parallelLimit(tasks, limit);
};


module.exports = parallelMapLimit;
