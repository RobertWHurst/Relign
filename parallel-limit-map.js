const parallelLimit = require('./parallel-limit');


const parallelLimitMap = (items, fn, limit) => {
  for (const prop in items) {
    const item = items[prop];
    items[prop] = () => fn(item);
  }
  return parallelLimit(items, limit);
};


module.exports = parallelLimitMap;
