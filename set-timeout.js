const exec = require('./exec');


class TimeoutPromise extends Promise {

  constructor(fn, duration) {
    if (typeof fn === 'number') {
      duration = fn;
      fn       = undefined;
    }
    let timeoutData = null;
    super((resolve, reject) => {
      timeoutData = { resolve, reject, fn, duration };
      if (typeof duration === 'number') {
        timeoutData.timeoutId = global.setTimeout(() => {
          exec(fn).then(resolve).catch(reject);
        }, duration);
      } else {
        fn(resolve, reject);
      }
    });

    this._parent      = null;
    this._timeoutData = timeoutData;
  }

  get _timeoutData() {
    return this._parent ? this._parent._timeoutData : this.__timeoutData;
  }

  set _timeoutData(timeoutData) {
    this.__timeoutData = timeoutData;
  }

  then(resolve, reject) {
    const promise   = super.then(resolve, reject);
    promise._parent = this;
    return promise;
  }

  clear(val) {
    const timeoutData = this._timeoutData;
    global.clearTimeout(timeoutData.timeoutId);
    timeoutData.resolve(val);
    return this;
  }

  reset() {
    const timeoutData = this._timeoutData;
    global.clearTimeout(timeoutData.timeoutId);
    timeoutData.timeoutId = global.setTimeout(() => {
      exec(timeoutData.fn).then(timeoutData.resolve).catch(timeoutData.reject);
    }, timeoutData.duration);
    return this;
  }
}

const setTimeout = (fn, d = 0) => {
  return new TimeoutPromise(fn, d);
};


exports = module.exports = setTimeout;
exports.TimeoutPromise = TimeoutPromise;
