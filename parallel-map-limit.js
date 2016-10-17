const parallelLimit = require('./parallel-limit');


const parallelMapLimit = (items, fn, limit) => {
  for (const prop in items) {
    const item = items[prop];
    items[prop] = () => fn(item);
  }
  return parallelLimit(items, limit);
};


module.exports = parallelMapLimit;
