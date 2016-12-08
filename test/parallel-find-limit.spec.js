const assert            = require('assert');
const setTimeout        = require('../set-timeout');
const parallelFindLimit = require('../parallel-find-limit');


describe('parallelFindLimit(items, worker(item) -> promise(val)) -> promise(val)', () => {

  it('processes items array and resolves the first item that causes the tester to resolve true', () => {
    const items = [1, 2, 3, 4];
    return parallelFindLimit(items, i => setTimeout(() => i === 3, 10), 2).then(r =>
      assert.deepEqual(r, 3));
  });

  it('processes items object and resolves the first item that causes the tester to resolve true', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return parallelFindLimit(items, i => setTimeout(() => i === 3, 10), 2).then(r =>
      assert.deepEqual(r, 3));
  });

  it('returns undefined if the items array does contain a value that satifies the test', () => {
    const items = [1, 2, 3, 4];
    return parallelFindLimit(items, i => false, 2).then(r =>
      assert.deepEqual(r, undefined));
  });

  it('returns undefined if the items object does contain a value that satifies the test', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return parallelFindLimit(items, i => false, 2).then(r =>
      assert.deepEqual(r, undefined));
  });

  it('can handle empty items array', () => {
    const items = [];
    return parallelFindLimit(items, i => i, 2).then(r =>
      assert.deepEqual(r, undefined));
  });

  it('can handle empty items object', () => {
    const items = {};
    return parallelFindLimit(items, i => i, 2).then(r =>
      assert.deepEqual(r, undefined));
  });
});
