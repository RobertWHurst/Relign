import { describe, it, expect } from 'vitest'
import { setTimeout } from '../set-timeout'
import { seriesReduce } from '../series-reduce'

describe('seriesReduce(items, worker(val, item) -> promise(val), val) -> promise(val)', () => {
  it('processes item arrays, executing the worker on each item and resolves the result', async () => {
    const items = [1, 2, 3, 4]

    const result = await seriesReduce(
      items,
      (m, i) => setTimeout(() => m + i, 10),
      0,
    )

    expect(result).toBe(10)
  })

  it('processes item objects, executing the worker on each item and resolves the result', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const result = await seriesReduce(
      items,
      (m, i) => setTimeout(() => m + i, 10),
      0,
    )

    expect(result).toBe(10)
  })

  it('can handle empty items array', async () => {
    const items: unknown[] = []
    return seriesReduce(items, (m) => m, 4).then((r) => expect(r).toBe(4))
  })

  it('can handle empty items object', async () => {
    const items = {}
    return seriesReduce(items, (m) => m, 4).then((r) => expect(r).toBe(4))
  })

  it('passes the memo, item, itemIndex, and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await seriesReduce(
      items,
      (memo, item, index, _items) => {
        expect(memo).toBe(4)
        expect(item).toBe(item)
        expect(items.indexOf(item)).toBe(index)
        expect(items).toBe(_items)
        count += 1
        return 4
      },
      4,
    )

    expect(count).toBe(3)
  })
})
