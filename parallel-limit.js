const seriesMap = require('./series-map');
const exec      = require('./exec');


const parallelLimit = (fns, limit) => {
  const data       = {};
  const props      = Object.keys(fns);
  const firstProps = props.splice(0, limit);

  const promises = firstProps.map((firstProp) => {
    return exec(fns[firstProp]).then((val) => {
      data[firstProp] = val;
      const nextProp = props.shift();
      return nextProp ?
        exec(fns[nextProp]).then(v => { data[nextProp] = v; }) :
        Promise.resolve();
    });
  });

  return Promise.all(promises).then(() => data);
};


module.exports = parallelLimit;
