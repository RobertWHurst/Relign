const exec = require('./exec');


const parallel = (fns) => {
  const data     = {};
  const props    = Object.keys(fns);
  const promises = props.map(p => exec(fns[p]).then(v => { data[p] = v; }));
  return Promise.all(promises).then(() => data);
};


module.exports = parallel;
