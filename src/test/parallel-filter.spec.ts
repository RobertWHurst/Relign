import { describe, it, expect } from 'vitest'
import { parallelFilter } from '../parallel-filter'

describe('parallelFilter(items, test(item) -> promise(val)) -> promise(val)', () => {
  it('processes item arrays, executing the test on each item and resolves the filtered results', async () => {
    const items = [1, 2, 3, 4]
    const results = await parallelFilter(items, (i) => i > 2)

    expect(results).toEqual([3, 4])
  })

  it('processes item objects, executing the test on each item and resolves the filtered results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const results = await parallelFilter(items, (i) => i > 2)

    expect(results).toEqual({ c: 3, d: 4 })
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const results = await parallelFilter(items, () => true)

    expect(results).toEqual([])
  })

  it('can handle empty items object', async () => {
    const items = {}
    const results = await parallelFilter(items, () => true)

    expect(results).toEqual({})
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await parallelFilter(items, (item, index, _items) => {
      expect(item).toEqual(index)
      expect(items).toEqual(_items)
      count += 1
      return true
    })

    expect(count).toEqual(3)
  })
})
