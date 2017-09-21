const exec = require('./exec');


const series = (tasks) => {
  const results = typeof tasks.length === 'number' ? [] : {};
  const props   = Object.keys(tasks);

  const rec = () => {
    const prop = props.shift();
    const fn   = tasks[prop];
    return prop !== undefined ?
      exec(fn).then(v => { results[prop] = v; }).then(rec) :
      Promise.resolve(results);
  };

  return rec();
};


module.exports = series;
