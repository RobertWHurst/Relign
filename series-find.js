const parallelMap = require('./parallel-map');
const exec        = require('./exec');


const parallelFind = (items, tester) => {
  const props = Object.keys(items);

  const rec = () => {
    const item = items[props.shift()];

    if (!item) { return Promise.resolve(); }

    return exec(() => tester(item)).then(ok => {
      if (!ok) { return rec(); }
      return item;
    });
  };

  return rec();
};


module.exports = parallelFind;
