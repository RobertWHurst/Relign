import { describe, it, expect, expectTypeOf } from 'vitest'
import { Exec, Executable, exec } from '../exec'

describe('exec(value) -> promise(result)', () => {
  it('takes a function that returns a promise, executes the function, then returns the promise', async () => {
    const v = await exec(() => Promise.resolve(1))

    expectTypeOf(v).toEqualTypeOf<number>()
    expect(v).toBe(1)
  })

  it("takes a function that returns a value, executes the function, then returns a promise that resolves to the function's return value", async () => {
    const v = await exec(() => 1)

    expectTypeOf(v).toEqualTypeOf<1>()
    expect(v).toBe(1)
  })

  it('takes a promise and returns it', async () => {
    const v = await exec(Promise.resolve(1))

    expectTypeOf(v).toEqualTypeOf<number>()
    expect(v).toBe(1)
  })

  it('takes a value and returns a promise that resolves it', async () => {
    const v = await exec(1)

    expectTypeOf(v).toEqualTypeOf<number>()
    expect(v).toBe(1)
  })
})

describe('Exec<V>', () => {
  it('equals the return type of exec(value)', () => {
    expectTypeOf<Exec<() => Promise<number>>>().toEqualTypeOf<number>()
    expectTypeOf<Exec<() => number>>().toEqualTypeOf<number>()
    expectTypeOf<Exec<Promise<number>>>().toEqualTypeOf<number>()
    expectTypeOf<Exec<number>>().toEqualTypeOf<number>()
  })
})

describe('Executable<V>', () => {
  it('equals the argument type of exec(value)', () => {
    expectTypeOf<Executable<number>>().toEqualTypeOf<
      (() => Promise<number>) | (() => number) | Promise<number> | number
    >()
  })
})
