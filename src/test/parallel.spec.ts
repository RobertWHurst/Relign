import { describe, it, expect, expectTypeOf } from 'vitest'
import { nextTick } from '../next-tick'
import { setTimeout } from '../set-timeout'
import { parallel } from '../parallel'

describe('parallel(tasks) -> promise(results)', () => {
  it('runs an array of promise returning functions and resolves with all of the results', async () => {
    const results = await parallel([1, () => 2, () => setTimeout(3, 100)])
    expectTypeOf(results).toEqualTypeOf<[1, 2, 3]>()
    expect(results).toEqual([1, 2, 3])
  })

  it('runs an object of promise returning functions and resolves with all of the results', async () => {
    const results = await parallel({
      a: 1,
      b: () => 2,
      c: () => setTimeout(3, 100),
    })
    expectTypeOf(results).toMatchTypeOf<{ a: 1; b: 2; c: 3 }>()
    expect(results).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('runs all the functions in parallel', async () => {
    let inFlight = 0
    let completed = 0

    await parallel([
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
        expect(inFlight).toBe(3)
        expect(completed).toBe(0)
        completed += 1
      },
    ])

    expect(inFlight).toBe(0)
    expect(completed).toBe(4)
  })

  it('captures a thrown error', async () => {
    expect(
      parallel({
        a: 1,
        b: () => 2,
        c: () => {
          throw new Error('error')
        },
      }),
    ).rejects.toThrow(/error/i)
  })

  it('can handle an empty tasks array', async () => {
    const results = await parallel([])
    expectTypeOf(results).toEqualTypeOf<[]>()
    expect(results).toEqual([])
  })

  it('can handle an empty tasks object', async () => {
    const results = await parallel({})
    expectTypeOf(results).toMatchTypeOf<Record<string, never>>()
    expect(results).toEqual({})
  })

  it('aborts early if a promise is rejected', () => {
    let bDone = false
    expect(
      parallel({
        a: Promise.reject(new Error('error')),
        b: nextTick(() => {
          bDone = true
        }),
      }),
    ).rejects.toThrow(/error/i)
    expect(bDone).toBe(false)
  })
})
