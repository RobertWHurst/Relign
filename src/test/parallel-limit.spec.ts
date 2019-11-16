import { describe, it, expect, expectTypeOf } from 'vitest'
import { setTimeout } from '../set-timeout'
import { parallelLimit } from '../parallel-limit'
import { nextTick } from '../next-tick'

describe('parallelLimit(tasks, limit) -> promise(val)', () => {
  it('runs an array of promise returning functions and resolves with all of the results', async () => {
    const results = await parallelLimit(
      [1, () => 2, () => setTimeout(3, 100)],
      2,
    )
    expectTypeOf(results).toEqualTypeOf<[1, 2, 3]>()
    expect(results).toEqual([1, 2, 3])
  })

  it('runs an object of promise returning functions and resolves with all of the results', async () => {
    const results = await parallelLimit(
      {
        a: 1,
        b: () => 2,
        c: () => setTimeout(3, 100),
      },
      2,
    )
    expectTypeOf(results).toMatchTypeOf<{ a: 1; b: 2; c: 3 }>()
    expect(results).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('runs all the functions in parallel up to the provided limit', async () => {
    let inFlight = 0
    let completed = 0

    await parallelLimit(
      [
        async () => {
          inFlight += 1
          expect(inFlight).lessThanOrEqual(2)
          await nextTick()
          inFlight -= 1
          completed += 1
        },
        async () => {
          inFlight += 1
          expect(inFlight).lessThanOrEqual(2)
          await nextTick()
          inFlight -= 1
          completed += 1
        },
        async () => {
          inFlight += 1
          expect(inFlight).lessThanOrEqual(2)
          await nextTick()
          inFlight -= 1
          completed += 1
        },
        async () => {
          expect(inFlight).lessThanOrEqual(2)
          expect(completed).lessThanOrEqual(2)
          completed += 1
        },
      ],
      2,
    )

    expect(inFlight).toBe(0)
    expect(completed).toBe(4)
  })

  it('captures a thrown error', async () => {
    expect(
      parallelLimit(
        {
          a: 1,
          b: () => 2,
          c: () => {
            throw new Error('error')
          },
        },
        2,
      ),
    ).rejects.toThrow(/error/i)
  })

  it('can handle an empty tasks array', async () => {
    const results = await parallelLimit([], 2)
    expectTypeOf(results).toEqualTypeOf<[]>()
    expect(results).toEqual([])
  })

  it('can handle an empty tasks object', async () => {
    const results = await parallelLimit({}, 2)
    expectTypeOf(results).toMatchTypeOf<Record<string, never>>()
    expect(results).toEqual({})
  })

  it('aborts early if a promise is rejected', () => {
    let bDone = false
    expect(
      parallelLimit(
        {
          a: Promise.reject(new Error('error')),
          b: nextTick(() => {
            bDone = true
          }),
        },
        2,
      ),
    ).rejects.toThrow(/error/i)
    expect(bDone).toBe(false)
  })
})
