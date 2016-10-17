

const exec = (fn) => {
  try {
    const val = typeof fn === 'function' ? fn() : fn;
    if (!val || typeof val !== 'object' || typeof val.then !== 'function') {
      return Promise.resolve(val);
    }
    return val;
  } catch (err) {
    return Promise.reject(err);
  }
};


module.exports = exec;
