const assert           = require('assert');
const setTimeout       = require('../set-timeout');
const parallelMapLimit = require('../parallel-map-limit');


describe('parallelMapLimit(items, worker(item) -> promise(val)) -> promise(val)', () => {

  it('processes item arrays, executing the worker on each item and resolves the mapped results', () => {
    const items = [1, 2, 3, 4];
    return parallelMapLimit(items, i => setTimeout(() => i + 1, 10), 2).then(d =>
      assert.deepEqual(d, [2, 3, 4, 5]));
  });

  it('processes item objects, executing the worker on each item and resolves the mapped results', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return parallelMapLimit(items, i => setTimeout(() => i + 1, 10), 2).then(d =>
      assert.deepEqual(d, { a: 2, b: 3, c: 4, d: 5 }));
  });
});