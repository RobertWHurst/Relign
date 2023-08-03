import { describe, it, expect } from 'vitest'
import { setTimeout } from '../set-timeout'
import { seriesFind } from '../series-find'

describe('seriesFind(items, worker(item) -> promise(val)) -> promise(val)', () => {
  it('processes items array and resolves the first item that causes the tester to resolve true', () => {
    const items = [1, 2, 3, 4]
    return seriesFind(items, (i) => setTimeout(() => i === 2, 10)).then((r) =>
      expect(r).toBe(2),
    )
  })

  it('processes items object and resolves the first item that causes the tester to resolve true', () => {
    const items = { a: 1, b: 2, c: 3, d: 4 }
    return seriesFind(items, (i) => setTimeout(() => i === 2, 10)).then((r) =>
      expect(r).toBe(2),
    )
  })

  it('can handle empty items array', () => {
    const items: number[] = []
    return seriesFind(items, (i) => !!i).then((r) => expect(r).toBe(undefined))
  })

  it('can handle empty items object', () => {
    const items: { [k: string]: number } = {}
    return seriesFind(items, (i) => !!i).then((r) => expect(r).toBe(undefined))
  })

  it('passes the itemIndex and items array as a second and third argument', () => {
    const items = [0, 1, 2]
    return seriesFind(items, (item, index, _items) => {
      expect(item).toBe(index)
      expect(items).toBe(_items)
      return false
    })
  })
})
