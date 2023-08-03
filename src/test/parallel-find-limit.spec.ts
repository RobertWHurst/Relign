import { describe, it, expect } from 'vitest'
import { parallelFindLimit } from '../parallel-find-limit'
import { setTimeout } from '../set-timeout'

describe('parallelFindLimit(items, worker(item) -> promise(val)) -> promise(val)', () => {
  it('processes items array and resolves the first item that causes the tester to resolve true', async () => {
    const items = [1, 2, 3, 4]
    const result = await parallelFindLimit(
      items,
      (i) => setTimeout(i === 3, 10),
      2,
    )

    expect(result).toEqual(3)
  })

  it('processes items object and resolves the first item that causes the tester to resolve true', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const result = await parallelFindLimit(
      items,
      (i) => setTimeout(i === 3, 10),
      2,
    )

    expect(result).toEqual(3)
  })

  it('returns undefined if the items array does contain a value that satisfies the test', async () => {
    const items = [1, 2, 3, 4]
    const result = await parallelFindLimit(items, () => false, 2)

    expect(result).toEqual(undefined)
  })

  it('returns undefined if the items object does contain a value that satisfies the test', async () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    const result = await parallelFindLimit(items, () => false, 2)

    expect(result).toEqual(undefined)
  })

  it('can handle empty items array', async () => {
    const items = []
    const result = await parallelFindLimit(items, (i) => i, 2)

    expect(result).toEqual(undefined)
  })

  it('can handle empty items object', async () => {
    const items = {}
    const result = await parallelFindLimit(items, (i) => i, 2)

    expect(result).toEqual(undefined)
  })

  it('passes the itemIndex and items array as a second and third argument', async () => {
    let count = 0
    const items = [0, 1, 2]
    await parallelFindLimit(
      items,
      (item, index, _items) => {
        expect(item).toEqual(index)
        expect(items).toEqual(_items)
        count += 1
        return false
      },
      2,
    )

    expect(count).toEqual(3)
  })
})
