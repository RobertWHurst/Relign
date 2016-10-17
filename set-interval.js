const exec = require('./exec');


class IntervalPromise extends Promise {

  constructor(fn, duration) {
    if (typeof fn === 'number') {
      duration = fn;
      fn       = undefined;
    }
    let _resolve, _intervalId;
    super((resolve, reject) => {
      _resolve = resolve;
      if (typeof duration === 'number') {
        _intervalId = global.setInterval(() => {
          exec(fn).catch(err => {
            clearInterval(_intervalId);
            reject(err);
          });
        }, duration);
      } else {
        fn(resolve, reject);
      }
    });
    this._intervalId = _intervalId;
    this._resolve    = _resolve;
  }

  then(fn) {
    const promise       = super.then(fn);
    promise._intervalId = this._intervalId;
    promise._resolve    = this._resolve;
    return promise;
  }

  clear(val) {
    clearInterval(this._intervalId);
    this._resolve(val);
  }
}

const setInterval = (fn, d = 0) => {
  return new IntervalPromise(fn, d);
};


exports.module.exports = setInterval;
exports.IntervalPromise = IntervalPromise;
