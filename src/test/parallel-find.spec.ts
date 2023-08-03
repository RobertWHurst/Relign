import { describe, it, expect } from 'vitest'
import { parallelFind } from '../parallel-find'
import { setTimeout } from '../set-timeout'

describe('parallelFind(items, worker(item) -> promise(val)) -> promise(val)', () => {
  it('processes items array and resolves the first item that causes the tester to resolve true', async () => {
    const items = [1, 2, 3, 4]
    const result = await parallelFind(items, (i) => setTimeout(i === 2, 10))

    expect(result).toBe(2)
  })

  it('processes items object and resolves the first item that causes the tester to resolve true', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const result = await parallelFind(items, (i) => setTimeout(i === 2, 10))

    expect(result).toBe(2)
  })

  it('returns undefined if the items array does contain a value that satifies the test', async () => {
    const items = [1, 2, 3, 4]
    const result = await parallelFind(items, () => false)

    expect(result).toBe(undefined)
  })

  it('returns undefined if the items object does contain a value that satifies the test', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const result = await parallelFind(items, () => false)

    expect(result).toBe(undefined)
  })

  it('can handle empty items array', async () => {
    const items: string[] = []
    const result = await parallelFind(items, () => true)

    expect(result).toBe(undefined)
  })

  it('can handle empty items object', async () => {
    const items: Record<string, string> = {}
    const result = await parallelFind(items, () => true)

    expect(result).toBe(undefined)
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await parallelFind(items, (item, index, _items) => {
      count += 1
      expect(item).toBe(index)
      expect(items).toBe(_items)
      return false
    })

    expect(count).toBe(3)
  })

  it('will exit early if an item is found before all items are resolved', async () => {
    let inFlight = 0
    let completed = 0
    const items = [
      { val: 1, delay: 10 },
      { val: 2, delay: 5 },
      { val: 3, delay: 10 },
      { val: 4, delay: 20 },
      { val: 5, delay: 30 },
    ]

    const result = await parallelFind(items, async (item) => {
      inFlight += 1
      const isMatch = await setTimeout(item.val === 4, item.delay)
      inFlight -= 1
      completed += 1
      return isMatch
    })

    expect(inFlight).toBe(1)
    expect(completed).toBe(4)
    expect(result).toEqual({ val: 4, delay: 20 })
  })
})
