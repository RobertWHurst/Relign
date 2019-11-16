import { describe, it, expect, expectTypeOf } from 'vitest'
import { seriesFilter } from '../series-filter'


describe('seriesFilter(items, test(item) -> promise(val)) -> promise(val)', () => {

  it('processes item arrays, executing the test on each item and resolves the filtered results', async () => {
    const items = [1, 2, 3, 4];
    const results = await seriesFilter(items, i => i > 2)

    expectTypeOf(results).toEqualTypeOf<number[]>()
    expect(results).toEqual([3, 4]);
  });

  it('processes item objects, executing the test on each item and resolves the filtered results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 };
    const results = await seriesFilter(items, i => i > 2)

    expectTypeOf(results).toEqualTypeOf<Record<string, number>>()
    expect(results).toEqual({ c: 3, d: 4 });
  });

  it('can handle empty items array', async () => {
    const items: string[] = [];
    const results = await seriesFilter(items, i => !!i)

    expect(results).toEqual([]);
  });

  it('can handle empty items object', async () => {
    const items: Record<string, string> = {};
    const results = await seriesFilter(items, i => !!i)
    
    expect(results).toEqual({})
  });

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0;
    const items = [0, 1, 2];
    await seriesFilter(items, (item, index, _items) => {
      expect(item).toEqual(index);
      expect(items).toEqual(_items);
      count += 1;
      return false
    });

    expect(count).toBe(3)
  });
});
