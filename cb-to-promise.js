const util = require('util');


const wrapCb = (cbFn) => {
  if (typeof cbFn !== 'function' || cbFn.length < 1) { return cbFn; }
  const pfn = (...args) => new Promise((resolve, reject) => {
    cbFn(...args, (err, ...results) => {
      if (err) { return reject(err); }
      if (results.length === 0) { return resolve(); }
      resolve(results.length === 1 ? results[0] : results);
    });
  });
  return pfn;
};


module.exports = wrapCb;