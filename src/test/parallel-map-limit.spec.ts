import { describe, it, expect } from 'vitest'
import { parallelMapLimit } from '../parallel-map-limit'
import { setTimeout } from '../set-timeout'
import { expectTypeOf } from 'vitest'

describe('parallelMapLimit(items, worker(item) -> promise(val)) -> promise(val)', () => {
  it('processes item arrays, executing the worker on each item and resolves the mapped results', async () => {
    const items = [1, 2, 3, 4]
    const results = await parallelMapLimit(
      items,
      (i) => setTimeout(i + 1, 10),
      2,
    )

    expectTypeOf(results).toEqualTypeOf<number[]>()
    expect(results).toEqual([2, 3, 4, 5])
  })

  it('processes item objects, executing the worker on each item and resolves the mapped results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const results = await parallelMapLimit(
      items,
      (i) => setTimeout(i + 1, 10),
      2,
    )

    expect(results).toEqual({ a: 2, b: 3, c: 4, d: 5 })
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const results = await parallelMapLimit(items, (i) => i, 2)

    expectTypeOf(results).toEqualTypeOf<string[]>()
    expect(results).toEqual([])
  })

  it('can handle empty items object', async () => {
    const items = {}
    const results = await parallelMapLimit(items, (i) => i, 2)

    expectTypeOf(results).toMatchTypeOf<Record<string, never>>()
    expect(results).toEqual({})
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]

    await parallelMapLimit(
      items,
      (item, index, _items) => {
        expect(item).toEqual(index)
        expect(items).toEqual(_items)
        count += 1
      },
      2,
    )

    expect(count).toEqual(3)
  })
})
