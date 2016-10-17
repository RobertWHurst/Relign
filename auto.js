const exec     = require('./exec');
const parallel = require('./parallel');


const auto = (tasks) => {
  const results = typeof tasks.length === 'number' ? [] : {};

  const executeNextTasks = (lastTaskName) => {
    const nextTaskNames = Object.keys(tasks)
      .filter(n => typeof tasks[n][0] === 'function');

    if (nextTaskNames.length < 0) {
      return Promise.resolve();
    }

    const promises = nextTaskNames.map((nextTaskName) => {
      const task = tasks[nextTaskName];
      delete tasks[nextTaskName];

      return exec(task[0])
        .then((value) => {
          results[nextTaskName] = value;
        })
        .then(() => {
          for (const taskName in tasks) {
            const task = tasks[taskName];
            const i    = task.indexOf(nextTaskName);
            if (i > -1) { task.splice(i, 1); }
          }
        })
        .then(executeNextTasks);
    });

    return Promise.all(promises).then(() => results);
  }

  const taskNames = Object.keys(tasks);
  for (const taskName of taskNames) {
    if (typeof tasks[taskName] === 'function') {
      tasks[taskName] = [tasks[taskName]];
    }
    for (const depTaskName of tasks[taskName]) {
      if (typeof depTaskName === 'string' && !taskNames.includes(depTaskName)) {
        throw new Error(
          `The task ${taskName} is depends upon a task named ${depTaskName}, ` +
          `but ${depTaskName} does not exist`
        );
      }
    }
  }

  return executeNextTasks();
};


module.exports = auto;
