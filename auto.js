const parallel = require('./each');


const auto = (tasks) => {
  const data           = {};
  const props          = Object.keys(tasks);
  const unblockedProps = props
    .map(p => typeof tasks[p] === 'function' ? [tasks[p]] : tasks[p])
    .filter(p => typeof tasks[p][0] === 'function');

  return parallel(unblockedProps.map(p => () => {
    data[p] = tasks[p](data);
  })).then(() => {
    unblockedProps.forEach(p => { delete tasks[p]; });
    const nexProps = props.filter(p => !!tasks[p]);

    if (nexProps.length < 1) { return Promise.resolve(data); }

    nexProps.forEach(p => {
      tasks[p] = tasks[p].filter(d => !unblockedProps.includes(d));
    });
    return auto(tasks);
  });
};


module.exports = auto;
