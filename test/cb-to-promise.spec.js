const assert      = require('assert');
const cbToPromise = require('../cb-to-promise');


describe('cbToPromise(cbFn(...args, cb)) -> pFn(...args) -> promise', () => {

  it('accepts a function that expects a callback, and wraps it with a function that converts the callback to a returned promise', () =>
    cbToPromise((cb) => cb(null, 'val'))().then(v => assert.equal(v, 'val')));

  it('will cause the promise to reject with a give error if passed as the callback\'s first argument', () =>
    cbToPromise((cb) => cb(new Error('err'), 'val'))().catch(err => assert.equal(err.message, 'err')));

  it('collect callback arguments into an array if more than one is supplied', () =>
    cbToPromise((cb) => cb(null, 'val1', 'val2'))().then(([val1, val2]) => assert.equal(val1, 'val1') && assert.equal(val2, 'val2')));

  it('collect callback arguments into an array if more than one is supplied', () =>
    cbToPromise((cb) => cb(null, 'val1', 'val2'))().then(([val1, val2]) => assert.equal(val1, 'val1') && assert.equal(val2, 'val2')));
});
