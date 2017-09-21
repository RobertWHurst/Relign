const exec = require('./exec');


const reduce = (items, fn, result) => {
  const props = Object.keys(items);

  const tasks = typeof items.length === 'number' ? [] : {};
  for (const prop in items) {
    tasks[prop] = (r) => fn(r, items[prop], prop, items);
  }

  const rec = () => {
    const prop = props.shift();
    const fn   = tasks[prop];
    return prop !== undefined ?
      exec(() => fn(result)).then(v => { result = v; }).then(rec) :
      Promise.resolve(result);
  };

  return rec();
};


module.exports = reduce;
