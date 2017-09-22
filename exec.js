const Generator = (function* () {}).constructor;

const exec = (fn) => {
  const isFn  = typeof fn === 'function';
  const useCb = isFn && fn.length > 0;
  const isGen = isFn && fn instanceof Generator;

  if (isGen) {
    const _fn = fn;
    fn = () => {
      const gen  = _fn();
      const vals = [];
      const rec  = () => {
        const result = gen.next();
        return exec(result.value).then((val) => {
          vals.push(val);
          return result.done ? vals : rec();
        });
      };
      return rec();
    };
  } else if (useCb) {
    const _fn = fn;
    fn = () => new Promise((rs, rj) =>
      _fn((e, ...a) => e ? rj(e) : rs(a.length < 2 ? a[0] : a)));
  }

  try {
    const val = isFn ? fn() : fn;
    if (!val || typeof val !== 'object' || typeof val.then !== 'function') {
      return Promise.resolve(val);
    }
    return val;
  } catch (err) {
    return Promise.reject(err);
  }
};


module.exports = exec;
