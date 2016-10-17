const assert   = require('assert');
const nextTick = require('../next-tick');
const series = require('../series');


describe('series(fns) -> promise(data)', () => {

  it('runs an array of promise returning functions and resolves with all of the data', () =>
    series([
      1,
      () => 2,
      () => new Promise(r => setTimeout(r(3), 100))
    ]).then(data => assert(data, [1, 2, 3])));

  it('runs an object of promise returning functions and resolves with all of the data', () =>
    series({
      a: 1,
      b: () => 2,
      c: () => new Promise(r => setTimeout(r(3), 100))
    }).then(data => assert(data, { a: 1, b: 2, c: 3 })));

  it('runs all the functions in series');

  it('captures a thrown error', () =>
    series({
      a: 1,
      b: () => 2,
      c: () => { throw new Error('error'); }
    }).catch(err => assert.equal(err.message, 'error')));
});
