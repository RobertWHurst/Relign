const exec = require('./exec');


const series = (fns) => {
  const data  = {};
  const props = Object.keys(fns);
  const rec   = () => {
    const prop = props.shift();
    const fn   = fns[prop];
    return fn ?
      exec(fn).then(v => { data[prop] = v; }).then(rec) :
      Promise.resolve(data);
  };

  return rec();
};


module.exports = series;
