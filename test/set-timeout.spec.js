const assert     = require('assert');
const setTimeout = require('../set-timeout');


describe('setTimeout(fn() -> promise(val), duration) -> timeoutPromise(val)', () => {

  it('executes the fn once the duration elapses then resolves the value resolved by the fn', () => {
    const start = Date.now();

    return setTimeout(() => {
      return new Promise((resolve) => {
        global.setTimeout(() => resolve('val'), 10);
      });
    }, 10).then(v => {
      const end = Date.now();

      assert.ok(end - start >= 20);
      assert.equal(v, 'val');
    });
  });
});


describe('setTimeout(fn() -> val, duration) -> timeoutPromise(val)', () => {

  it('executes the fn once the duration elapses then resolves the value returned by the fn', () => {
    const start = Date.now();

    return setTimeout(() => 'val', 10).then(v => {
      const end = Date.now();

      assert.ok(end - start >= 10);
      assert.equal(v, 'val');
    });
  });
});


describe('setTimeout(val, duration) -> timeoutPromise(val)', () => {

  it('resolves the value given after the duration elapses', () => {
    const start = Date.now();

    return setTimeout('val', 10).then(v => {
      const end = Date.now();

      assert.ok(end - start >= 10);
      assert.equal(v, 'val');
    });
  });
});


describe('setTimeout(duration) -> timeoutPromise()', () => {

  it('resolves after the duration elapses', () => {
    const start = Date.now();

    return setTimeout(10).then(() => {
      const end = Date.now();

      assert.ok(end - start >= 10);
    });
  });
});


describe('new TimeoutPromise(fn, duration)', () => {


  describe('#clear(newVal) -> this', () => {

    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve newVal immediately', () => {
      const start = Date.now();

      return setTimeout('val', 10).then(v => {
        const end = Date.now();

        assert.ok(end - start < 10);
        assert.equal(v, 'newVal');
      }).clear('newVal');
    })
  });


  describe('#clear() -> this', () => {

    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve immediately', () => {
      const start = Date.now();

      return setTimeout('val', 10).then(() => {
        const end = Date.now();

        assert.ok(end - start < 10);
      }).clear();
    })
  });
});
