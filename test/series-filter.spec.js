const assert       = require('assert');
const setTimeout   = require('../set-timeout');
const seriesFilter = require('../series-filter');


describe('seriesFilter(items, test(item) -> promise(val)) -> promise(val)', () => {

  it('processes item arrays, executing the test on each item and resolves the filtered results', () => {
    const items = [1, 2, 3, 4];
    return seriesFilter(items, i => i > 2).then(d =>
      assert.deepEqual(d, [3, 4]));
  });

  it('processes item objects, executing the test on each item and resolves the filtered results', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    return seriesFilter(items, i => i > 2).then(d =>
      assert.deepEqual(d, { c: 3, d: 4 }));
  });

  it('can handle empty items array', () => {
    const items = [];
    return seriesFilter(items, i => i).then(r =>
      assert.deepEqual(r, []));
  });

  it('can handle empty items object', () => {
    const items = {};
    return seriesFilter(items, i => i).then(r =>
      assert.deepEqual(r, {}));
  });

  it('passes the itemIndex and items array as a second and third argument', () => {
    const items = [0, 1, 2];
    return seriesFilter(items, (item, index, _items) => {
      assert.equal(item, index);
      assert.equal(items, _items);
    });
  });
});
