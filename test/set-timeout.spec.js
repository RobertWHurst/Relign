const assert        = require('assert');
const sinon         = require('sinon');
const setTimeout    = require('../set-timeout');


describe('setTimeout(fn() -> promise(val), duration) -> timeoutPromise(val)', () => {

  it('executes the fn once the duration elapses then resolves the value resolved by the fn', (done) => {
    const clock = sinon.useFakeTimers();
    const cb    = sinon.stub();

    const executor = sinon.spy((resolve) => {
      global.setTimeout(() => resolve('val'), 10);
    });

    setTimeout(() => {
      return new Promise(executor);
    }, 10).then(cb);

    sinon.assert.notCalled(executor);
    sinon.assert.notCalled(cb);

    clock.tick(10);

    sinon.assert.calledOnce(executor);
    sinon.assert.notCalled(cb);

    clock.tick(10);
    clock.restore();
    global.setTimeout(() => {

      sinon.assert.calledOnce(cb);
      sinon.assert.calledWith(cb, 'val');

      done();
    }, 0);
  });
});


describe('setTimeout(fn() -> val, duration) -> timeoutPromise(val)', () => {

  it('executes the fn once the duration elapses then resolves the value returned by the fn', (done) => {
    const clock = sinon.useFakeTimers();
    const cb    = sinon.stub();

    const fn = sinon.spy(() => 'val');

    setTimeout(fn, 10).then(cb);

    sinon.assert.notCalled(fn);
    sinon.assert.notCalled(cb);

    clock.tick(10);
    clock.restore();

    sinon.assert.calledOnce(fn);

    global.setTimeout(() => {

      sinon.assert.calledOnce(cb);
      sinon.assert.calledWith(cb, 'val');

      done();
    }, 0);
  });
});


describe('setTimeout(val, duration) -> timeoutPromise(val)', () => {

  it('resolves the value given after the duration elapses', (done) => {
    const clock = sinon.useFakeTimers();
    const cb    = sinon.stub();

    setTimeout('val', 10).then(cb);

    sinon.assert.notCalled(cb);

    clock.tick(10);
    clock.restore();
    global.setTimeout(() => {

      sinon.assert.calledOnce(cb);
      sinon.assert.calledWith(cb, 'val');

      done();
    }, 0);
  });
});


describe('setTimeout(duration) -> timeoutPromise()', () => {

  it('resolves after the duration elapses', (done) => {
    const clock = sinon.useFakeTimers();
    const cb    = sinon.stub();

    setTimeout(10).then(cb);

    sinon.assert.notCalled(cb);

    clock.tick(10);
    clock.restore();
    global.setTimeout(() => {

      sinon.assert.calledOnce(cb);

      done();
    }, 0);
  });
});


describe('new TimeoutPromise(fn, duration)', () => {


  describe('#clear(newVal) -> this', () => {

    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve newVal immediately', (done) => {
      const clock = sinon.useFakeTimers();
      const cb    = sinon.stub();

      const timeoutPromise = setTimeout('val', 10).then(cb);

      clock.tick(1);

      timeoutPromise.clear('newVal');

      clock.restore();
      global.setTimeout(() => {

        sinon.assert.calledOnce(cb);
        sinon.assert.calledWith(cb, 'newVal');

        done();
      });
    });
  });


  describe('#clear() -> this', () => {

    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve immediately', (done) => {
      const clock = sinon.useFakeTimers();
      const cb    = sinon.stub();

      const timeoutPromise = setTimeout('val', 10).then(cb);

      clock.tick(1);

      timeoutPromise.clear();

      clock.restore();
      global.setTimeout(() => {

        sinon.assert.calledOnce(cb);
        sinon.assert.calledWith(cb, undefined);

        done();
      });
    })
  });


  describe('#reset() -> this', () => {

    it('pospones the execution of the timeout fn', (done) => {
      const clock = sinon.useFakeTimers();
      const fn    = sinon.stub().returns('val');
      const cb    = sinon.stub();

      const timeoutPromise = setTimeout(fn, 10).then(cb);

      clock.tick(5);

      timeoutPromise.reset();

      clock.tick(5);

      sinon.assert.notCalled(fn);

      clock.tick(5);

      clock.restore();
      global.setTimeout(() => {

        sinon.assert.calledOnce(fn);
        sinon.assert.calledOnce(cb);
        sinon.assert.calledWith(cb, 'val');

        done();
      });
    })
  });
});
