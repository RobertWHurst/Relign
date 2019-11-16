import { describe, it, expect, expectTypeOf } from 'vitest'
import { cbToPromise } from '../cb-to-promise'

describe('cbToPromise(cbFn(...args, cb)) -> pFn(...args) -> promise', () => {
  it('accepts a function that expects a callback, and wraps it with a function that converts the callback to a returned promise', async () => {
    const callbackStyleFn = (cb: (err: any, val: string) => void) =>
      cb(null, 'val')

    const promiseStyleFn = cbToPromise(callbackStyleFn)

    expectTypeOf(promiseStyleFn).toEqualTypeOf<() => Promise<string>>()

    const v = await promiseStyleFn()

    expect(v).toBe('val')
  })

  it('collect callback arguments into an array if more than one is supplied', async () => {
    const callbackStyleFn = (
      cb: (err: any, val1: string, val2: string) => void,
    ) => cb(null, 'val1', 'val2')

    const promiseStyleFn = cbToPromise(callbackStyleFn)

    expectTypeOf(promiseStyleFn).toEqualTypeOf<
      () => Promise<[string, string]>
    >()

    const [val1, val2] = await promiseStyleFn()

    expect(val1).toBe('val1')
    expect(val2).toBe('val2')
  })

  it('pass function arguments through correctly', async () => {
    const callbackStyleFn = (
      a1: number,
      cb: (err: null, val1: number, val2: string) => void,
    ) => cb(null, a1, 'val2')

    const promiseStyleFn = cbToPromise(callbackStyleFn)

    expectTypeOf(promiseStyleFn).toEqualTypeOf<
      (a1: number) => Promise<[number, string]>
    >()

    const [val1, val2] = await promiseStyleFn(30)

    expect(val1).toBe(30)
    expect(val2).toBe('val2')
  })

  it("correctly maps the types of the function's arguments", async () => {
    const callbackStyleFn = (
      val1: string,
      val2: number,
      val3: boolean,
      val4: null,
      val5: undefined,
      cb: (err: any) => void,
    ) => cb(null)

    const promiseStyleFn = cbToPromise(callbackStyleFn)

    expectTypeOf(promiseStyleFn).toEqualTypeOf<
      (
        val1: string,
        val2: number,
        val3: boolean,
        val4: null,
        val5: undefined,
      ) => Promise<void>
    >()

    const v = await promiseStyleFn('val', 1, true, null, undefined)

    expectTypeOf(v).toEqualTypeOf<void>()
    expect(v).toBe(undefined)
  })

  it('correctly maps the types of the callback arguments', async () => {
    const callbackStyleFn = (
      cb: (
        err: any,
        val1: string,
        val2: number,
        val3: boolean,
        val4: null,
        val5: undefined,
        val6: symbol,
      ) => void,
    ) => cb(null, 'val', 1, true, null, undefined, Symbol('sym'))

    const promiseStyleFn = cbToPromise(callbackStyleFn)

    expectTypeOf(promiseStyleFn).toEqualTypeOf<
      () => Promise<[string, number, boolean, null, undefined, symbol]>
    >()

    const v = await promiseStyleFn()

    expectTypeOf(v).toEqualTypeOf<
      [string, number, boolean, null, undefined, symbol]
    >()
  })

  it("will cause the promise to reject with a give error if passed as the callback's first argument", async () => {
    expect(
      cbToPromise((cb: (err: Error, val: string) => void) =>
        cb(new Error('err'), 'val'),
      )(),
    ).rejects.toThrow(/err/i)
  })
})
