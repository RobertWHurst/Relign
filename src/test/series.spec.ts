import { describe, it, expect, expectTypeOf } from 'vitest'
import { nextTick } from '../next-tick'
import { setTimeout } from '../set-timeout'
import { series } from '../series'

describe('series(tasks) -> promise(results)', () => {
  it('runs an array of promise returning functions and resolves with all of the results', async () => {
    const results = await series([1, () => 2, () => setTimeout(3, 100)])

    expectTypeOf(results).toEqualTypeOf<[1, 2, 3]>()
    expect(results).toEqual([1, 2, 3])
  })

  it('runs an object of promise returning functions and resolves with all of the results', async () => {
    const results = await series({
      a: 1,
      b: () => 2,
      c: () => setTimeout(3, 100),
    })

    expectTypeOf(results).toEqualTypeOf<{ a: 1; b: 2; c: 3 }>()
    expect(results).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('runs all the functions in series', async () => {
    let inFlight = 0
    let completed = 0

    await series([
      async () => {
        inFlight += 1
        await nextTick()
        inFlight -= 1
        completed += 1
      },
      async () => {
        inFlight += 1
        await nextTick()
        inFlight -= 1
        completed += 1
      },
      async () => {
        inFlight += 1
        await nextTick()
        inFlight -= 1
        completed += 1
      },
      async () => {
        expect(inFlight).toBe(0)
        expect(completed).toBe(3)
        completed += 1
      },
    ])

    expect(inFlight).toBe(0)
    expect(completed).toBe(4)
  })

  it('captures a thrown error', async () => {
    expect(
      series({
        a: 1,
        b: () => 2,
        c: () => {
          throw new Error('error')
        },
      }),
    ).rejects.toThrow(/error/i)
  })

  it('can handle an empty tasks array', async () => {
    const result = await series([])

    expectTypeOf(result).toEqualTypeOf<[]>()
    expect(result).toEqual([])
  })

  it('can handle an empty tasks object', async () => {
    const result = await series({})

    expectTypeOf(result).toMatchTypeOf<Record<string, never>>()
    expect(result).toEqual({})
  })
})
