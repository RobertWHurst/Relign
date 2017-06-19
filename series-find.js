const parallelMap = require('./parallel-map');
const exec        = require('./exec');


const parallelFind = (items, tester) => {
  const props = Object.keys(items);

  const rec = () => {
    const prop = props.shift();
    const item = items[prop];

    if (!item) { return Promise.resolve(); }

    return exec(() => tester(item, prop, items)).then(ok => {
      if (!ok) { return rec(); }
      return item;
    });
  };

  return rec();
};


module.exports = parallelFind;
