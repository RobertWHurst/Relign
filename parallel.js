const exec = require('./exec');


const parallel = (tasks) => {
  const results  = typeof tasks.length === 'number' ? [] : {};
  const props    = Object.keys(tasks);
  const promises = props.map(p => exec(tasks[p]).then(v => { results[p] = v; }));
  return Promise.all(promises).then(() => results);
};


module.exports = parallel;
