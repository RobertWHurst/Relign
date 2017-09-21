const assert     = require('assert');
const setTimeout = require('../set-timeout');
const reduce     = require('../reduce');


describe('reduce(items, worker(val, item) -> promise(val), val) -> promise(val)', () => {

  it('processes item arrays, executing the worker on each item and resolves the result', () => {
    const items = [1, 2, 3, 4];
    return reduce(items, (m, i) => setTimeout(() => m + i, 10), 0).then(r =>
      assert.deepEqual(r, 10));
  });

  it('processes item objects, executing the worker on each item and resolves the result', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return reduce(items, (m, i) => setTimeout(() => m + i, 10), 0).then(r =>
      assert.deepEqual(r, 10));
  });

  it('can handle empty items array', () => {
    const items = [];
    return reduce(items, (m, i) => m, 4).then(r =>
      assert.deepEqual(r, 4));
  });

  it('can handle empty items object', () => {
    const items = {};
    return reduce(items, (m, i) => m, 4).then(r =>
      assert.deepEqual(r, 4));
  });

  it('passes the memo, itemIndex and items array as a second and third argument', () => {
    const items = [0, 1, 2];
    return reduce(items, (memo, item, index, _items) => {
      assert.equal(memo, 4);
      assert.equal(item, index);
      assert.equal(items, _items);
      return 4;
    }, 4);
  });
});
