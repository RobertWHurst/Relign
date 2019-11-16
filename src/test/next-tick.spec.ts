import { describe, it, expect, expectTypeOf } from 'vitest'
import { nextTick } from '../next-tick'

describe('nextTick(fn() -> promise(result)) -> promise(result)', () => {
  it('executes the function after one tick then resolves the result resolved by the function', async () => {
    const v = await nextTick(() => new Promise<string>((r) => r('value')))

    expectTypeOf(v).toEqualTypeOf<string>()
    expect(v).toBe('value')
  })
})

describe('nextTick(fn() -> result) -> promise(result)', () => {
  it('executes the function after one tick then resolves the result returned by the function', async () => {
    const v = await nextTick(() => 'value')

    expectTypeOf(v).toEqualTypeOf<'value'>()
    expect(v).toBe('value')
  })
})

describe('nextTick(value) -> promise(value)', () => {
  it('resolves the value after one tick', async () => {
    const v = await nextTick('value')

    expectTypeOf(v).toEqualTypeOf<string>()
    expect(v).toBe('value')
  })
})

describe('nextTick() -> promise()', () => {
  it('resolves after one tick', async () => {
    const v = await nextTick()

    expectTypeOf(v).toEqualTypeOf<void>()
    expect(v).toBe(undefined)
  })
})
