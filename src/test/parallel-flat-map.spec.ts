import { describe, it, expect, expectTypeOf } from 'vitest'
import { setTimeout } from '../set-timeout'
import { parallelFlatMap } from '../parallel-flat-map'

describe('parallelFlatMap(items, worker(item) -> promise([vals])) -> promise([vals])', () => {
  it('processes item arrays, executing the worker on each item and resolves the flat mapped results', async () => {
    const items = [1, 2, 3, 4]
    const results = await parallelFlatMap(items, (i) =>
      setTimeout<number[]>([i, i + 1], 10),
    )

    expectTypeOf(results).toEqualTypeOf<number[]>()
    expect(results).toEqual([1, 2, 2, 3, 3, 4, 4, 5])
  })

  it('processes item objects, executing the worker on each item and resolves the flat mapped results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const results = await parallelFlatMap(items, (i, k) =>
      setTimeout(
        () => ({
          [k]: i,
          [k + '1']: i + 1,
        }),
        10,
      ),
    )

    expect(results).toEqual({
      a: 1,
      a1: 2,
      b: 2,
      b1: 3,
      c: 3,
      c1: 4,
      d: 4,
      d1: 5,
    })
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const result = await parallelFlatMap(items, (i) => [i, i + 1])

    expect(result).toEqual([])
  })

  it('can handle empty items object', async () => {
    const items: Record<string, any> = {}
    const results = await parallelFlatMap(items, (i, k) => ({
      [k]: i,
      [k + '1']: i + 1,
    }))

    expect(results).toEqual({})
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await parallelFlatMap(items, (item, index, _items) => {
      expect(item).toEqual(index)
      expect(items).toEqual(_items)
      count += 1
      return []
    })

    expect(count).toEqual(3)
  })
})
