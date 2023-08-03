import { describe, it, expect } from 'vitest'
import { parallelFilterLimit } from '../parallel-filter-limit'

describe('parallelFilterLimit(items, test(item) -> promise(val), limit) -> promise(val)', () => {
  it('processes item arrays, executing the test on each item and resolves the filtered results', async () => {
    const items = [1, 2, 3, 4]
    const results = await parallelFilterLimit(items, (i) => i > 2, 2)

    expect(results).toEqual([3, 4])
  })

  it('processes item objects, executing the test on each item and resolves the filtered results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const results = await parallelFilterLimit(items, (i) => i > 2, 2)

    expect(results).toEqual({ c: 3, d: 4 })
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const results = await parallelFilterLimit(items, () => true, 2)

    expect(results).toEqual([])
  })

  it('can handle empty items object', async () => {
    const items: Record<string, any> = {}
    const results = await parallelFilterLimit(items, () => true, 2)

    expect(results).toEqual({})
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await parallelFilterLimit(
      items,
      (item, index, _items) => {
        expect(item).toEqual(index)
        expect(items).toEqual(_items)
        count += 1
        return true
      },
      2,
    )

    expect(count).toEqual(3)
  })
})
