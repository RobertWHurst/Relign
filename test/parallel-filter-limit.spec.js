const assert             = require('assert');
const setTimeout         = require('../set-timeout');
const parallelFilterLimit = require('../parallel-filter-limit');


describe('parallelFilterLimit(items, test(item) -> promise(val), limit) -> promise(val)', () => {

  it('processes item arrays, executing the test on each item and resolves the filtered results', () => {
    const items = [1, 2, 3, 4];
    return parallelFilterLimit(items, i => i > 2, 2).then(d =>
      assert.deepEqual(d, [3, 4]));
  });

  it('processes item objects, executing the test on each item and resolves the filtered results', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return parallelFilterLimit(items, i => i > 2, 2).then(d =>
      assert.deepEqual(d, { c: 3, d: 4 }));
  });

  it('can handle empty items array', () => {
    const items = [];
    return parallelFilterLimit(items, i => i, 2).then(r =>
      assert.deepEqual(r, []));
  });

  it('can handle empty items object', () => {
    const items = {};
    return parallelFilterLimit(items, i => i, 2).then(r =>
      assert.deepEqual(r, {}));
  });
});
