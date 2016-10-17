const exec = require('./exec');


class TimeoutPromise extends Promise {

  constructor(fn, duration) {
    if (typeof fn === 'number') {
      duration = fn;
      fn       = undefined;
    }
    let _resolve, _timeoutId;
    super((resolve, reject) => {
      _resolve = resolve;
      if (typeof duration === 'number') {
        _timeoutId = global.setTimeout(() => {
          exec(fn).then(resolve).catch(reject);
        }, duration);
      } else {
        fn(resolve, reject);
      }
    });
    this._timeoutId = _timeoutId;
    this._resolve   = _resolve;
  }

  then(fn) {
    const promise      = super.then(fn);
    promise._timeoutId = this._timeoutId;
    promise._resolve   = this._resolve;
    return promise;
  }

  clear(val) {
    clearTimeout(this._timeoutId);
    this._resolve(val);
  }
}

const setTimeout = (fn, d = 0) => {
  return new TimeoutPromise(fn, d);
};


exports = module.exports = setTimeout;
exports.TimeoutPromise = TimeoutPromise;
