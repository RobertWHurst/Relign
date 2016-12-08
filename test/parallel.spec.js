const assert   = require('assert');
const nextTick = require('../next-tick');
const parallel = require('../parallel');


describe('parallel(tasks) -> promise(results)', () => {

  it('runs an array of promise returning functions and resolves with all of the results', () =>
    parallel([
      1,
      () => 2,
      () => new Promise(r => setTimeout(r(3), 100))
    ]).then(results => assert(results, [1, 2, 3])));

  it('runs an object of promise returning functions and resolves with all of the results', () =>
    parallel({
      a: 1,
      b: () => 2,
      c: () => new Promise(r => setTimeout(r(3), 100))
    }).then(results => assert(results, { a: 1, b: 2, c: 3 })));

  it('runs all the functions in parallel', () => {
    let   count   = 0;
    return parallel([
      () => { count += 1; return nextTick(() => { count -= 1 }); },
      () => { count += 1; return nextTick(() => { count -= 1 }); },
      () => { count += 1; return nextTick(() => { count -= 1 }); },
      () => { assert.equal(count, 3); }
    ]).then(() => assert.equal(count, 0));
  });

  it('captures a thrown error', () =>
    parallel({
      a: 1,
      b: () => 2,
      c: () => { throw new Error('error'); }
    }).catch(err => assert.equal(err.message, 'error')));

  it('can handle an empty tasks array', () =>
    parallel([]).then(r => assert.deepEqual(r, [])));

  it('can handle an empty tasks object', () =>
    parallel({}).then(r => assert.deepEqual(r, {})));
});
