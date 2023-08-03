import { describe, it, expect, expectTypeOf } from 'vitest'
import { setTimeout } from '../set-timeout'
import { parallelMap } from '../parallel-map'
import { nextTick } from '../next-tick'

describe('parallelMap(items, worker(item) -> promise(val)) -> promise(val)', () => {
  it('processes item arrays, executing the worker on each item and resolves the mapped results', async () => {
    const items = [1, 2, 3, 4]
    const results = await parallelMap(items, (i) => setTimeout(() => i + 1, 10))

    expectTypeOf(results).toEqualTypeOf<number[]>()
    expect(results).toEqual([2, 3, 4, 5])
  })

  it('processes item objects, executing the worker on each item and resolves the mapped results', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const results = await parallelMap(items, (i) => setTimeout(() => i + 1, 10))

    expectTypeOf(results).toEqualTypeOf<{
      a: number
      b: number
      c: number
      d: number
    }>()
    expect(results).toEqual({ a: 2, b: 3, c: 4, d: 5 })
  })

  it('executes the worker in parallel', async () => {
    let inFlight = 0
    let completed = 0
    const items = [1, 2, 3, 4]

    await parallelMap(items, async (item, index) => {
      expect(inFlight).toBe(index)
      inFlight += 1
      await nextTick()
      inFlight -= 1
      completed += 1
    })

    expect(inFlight).toBe(0)
    expect(completed).toBe(4)
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const results = await parallelMap(items, (i) => i)

    expectTypeOf(results).toEqualTypeOf<string[]>()
    expect(results).toEqual([])
  })

  it('can handle empty items object', async () => {
    const items = {}
    const results = await parallelMap(items, (i) => i)

    expectTypeOf(results).toMatchTypeOf<Record<string, never>>()
    expect(results).toEqual({})
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    const items = [0, 1, 2]
    let completed = 0

    await parallelMap(items, (item, index, _items) => {
      expectTypeOf(index).toEqualTypeOf<number>()
      expect(item).toEqual(index)
      expect(items).toEqual(_items)
      completed += 1
    })

    expect(completed).toBe(3)
  })

  it('passes the itemProp and items object as a second and third argument', async () => {
    const items = { a: 'a', b: 'b', c: 'c' }
    let completed = 0

    await parallelMap(items, (item, prop, _items) => {
      expectTypeOf(prop).toEqualTypeOf<'a' | 'b' | 'c'>()
      expect(item).toEqual(prop)
      expect(items).toEqual(_items)
      completed += 1
    })

    expect(completed).toBe(3)
  })
})
