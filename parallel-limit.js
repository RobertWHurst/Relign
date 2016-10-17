const seriesMap = require('./series-map');
const exec      = require('./exec');


const parallelLimit = (tasks, limit) => {
  const results    = typeof tasks.length === 'number' ? [] : {};
  const props      = Object.keys(tasks);
  const firstProps = props.splice(0, limit);

  const promises = firstProps.map((firstProp) => {
    return exec(tasks[firstProp]).then((val) => {
      results[firstProp] = val;
      const nextProp = props.shift();
      return nextProp ?
        exec(tasks[nextProp]).then(v => { results[nextProp] = v; }) :
        Promise.resolve();
    });
  });

  return Promise.all(promises).then(() => results);
};


module.exports = parallelLimit;
