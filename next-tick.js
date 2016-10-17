const exec = require('./exec');


const nextTick = (fn) =>
  new Promise((resolve, reject) =>
    process.nextTick(() =>
      exec(fn).then(resolve).catch(reject)));


module.exports = nextTick;
