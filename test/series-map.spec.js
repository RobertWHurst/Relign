const assert     = require('assert');
const setTimeout = require('../set-timeout');
const seriesMap  = require('../series-map');


describe('seriesMap(items, worker(item) -> promise(val)) -> promise(val)', () => {

  it('processes item arrays, executing the worker on each item and resolves the mapped results', () => {
    const items = [1, 2, 3, 4];
    return seriesMap(items, i => setTimeout(() => i + 1, 10)).then(d =>
      assert.deepEqual(d, [2, 3, 4, 5]));
  });

  it('processes item objects, executing the worker on each item and resolves the mapped results', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return seriesMap(items, i => setTimeout(() => i + 1, 10)).then(d =>
      assert.deepEqual(d, { a: 2, b: 3, c: 4, d: 5 }));
  });
});
