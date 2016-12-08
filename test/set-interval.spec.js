const assert      = require('assert');
const setInterval = require('../set-interval');


describe('setInterval(fn() -> promise(result)) -> intervalPromise(result)', () => {

  it('executes the passed function each time the interval elapses until cleared', () => {
    let   i = 0;
    const intervalPromise = setInterval(() => {
      i += 1;
      if (i === 3) {
        intervalPromise.clear('value');
      }
    });
    return intervalPromise.then((value) => assert.equal(value, 'value'));
  });
});


describe('new IntervalPromise(fn, duration) -> this', () => {


  describe('#clear(val)', () => {

    it('causes the intervalPromise to resolve', () =>
      setInterval(() => {}).clear('value').then(value => assert.equal(value, 'value')));
  });
});
