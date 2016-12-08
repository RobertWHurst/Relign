const assert   = require('assert');
const nextTick = require('../next-tick');


describe('nextTick(fn() -> promise(result)) -> promise(result)', () => {

  it('executes the function after one tick then resolves the result resolved by the function', () =>
    nextTick(() => new Promise(resolve => resolve('value')))
      .then((value) => assert.equal(value, 'value')));
});


describe('nextTick(fn() -> result) -> promise(result)', () => {

  it('executes the function after one tick then resolves the result returned by the function', () =>
    nextTick(() => 'value').then((value) => assert.equal(value, 'value')));
});


describe('nextTick(value) -> promise(value)', () => {

  it('resolves the value after one tick', () =>
    nextTick('value').then((value) => assert.equal(value, 'value')));
});


describe('nextTick() -> promise()', () => {

  it('resolves after one tick', () => nextTick());
});
