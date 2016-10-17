const assert       = require('assert');
const setTimeout   = require('../set-timeout');
const seriesConcat = require('../series-concat');


describe('seriesConcat(items, worker(item) -> promise(val)) -> promise(val)', () => {

  it('processes item arrays, executing the worker on each item and resolves the mapped results', () => {
    const items = [1, 2, 3, 4];
    return seriesConcat(items, i => setTimeout(() => [i - 1, i, i + 1], 10)).then(d =>
      assert.deepEqual(d, [0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5]));
  });

  it('processes item objects, executing the worker on each item and resolves the mapped results', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return seriesConcat(items, i => setTimeout(() => [i - 1, i, i + 1], 10)).then(d =>
      assert.deepEqual(d, [0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5]));
  });
});
