const parallel = require('./parallel');


const parallelMap = (items, fn) => {
  for (const prop in items) {
    const item = items[prop];
    items[prop] = () => fn(item);
  }
  return parallel(items);
};


module.exports = parallelMap;
