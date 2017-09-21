const assert          = require('assert');
const setTimeout      = require('../set-timeout');
const parallelFlatMap = require('../parallel-flat-map');


describe('parallelFlatMap(items, worker(item) -> promise([vals])) -> promise([vals])', () => {

    it('processes item arrays, executing the worker on each item and resolves the flat mapped results', () => {
      const items = [1, 2, 3, 4];
      return parallelFlatMap(items, i => setTimeout(() => [i, i + 1], 10)).then(d =>
        assert.deepEqual(d, [1, 2, 2, 3, 3, 4, 4, 5]));
    });

    it('processes item objects, executing the worker on each item and resolves the flat mapped results', () => {
      const items = { a: 1, b: 2, c: 3, d: 4 };
      return parallelFlatMap(items, (i, k) => setTimeout(() => ({
        [k]      : i,
        [k + '1']: i + 1
      }), 10)).then(d =>
        assert.deepEqual(d, { a: 1, a1: 2, b: 2, b1: 3, c: 3, c1: 4, d: 4, d1: 5 }));
    });

    it('can handle empty items array', () => {
      const items = [];
      return parallelFlatMap(items, i => [i, i + 1]).then(r =>
        assert.deepEqual(r, []));
    });

    it('can handle empty items object', () => {
      const items = {};
      return parallelFlatMap(items, (i, k) => ({
        [k]      : i,
        [k + '1']: i + 1
      })).then(r =>
        assert.deepEqual(r, {}));
    });

    it('passes the itemIndex and items array as a second and third argument', () => {
      const items = [0, 1, 2];
      return parallelFlatMap(items, (item, index, _items) => {
        assert.equal(item, index);
        assert.equal(items, _items);
      });
    });
});
