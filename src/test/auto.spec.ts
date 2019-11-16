import { describe, it, expect, assertType, expectTypeOf } from 'vitest'
import { auto } from '../auto'

describe('auto(tasks) -> promise(results)', () => {
  it('executes the tasks in the correct order then resolves the results', async () => {
    const execOrder: string[] = []
    const d = await auto({
      a: [
        'd',
        () => {
          execOrder.push('a')
          return 3
        },
      ],
      b: [
        () => {
          execOrder.push('b')
          return 1
        },
      ],
      c: [
        'a',
        'b',
        () => {
          execOrder.push('c')
          return 4
        },
      ],
      d: [
        () => {
          execOrder.push('d')
          return 2
        },
      ],
    })

    assertType<{
      a: number
      b: number
      c: number
      d: number
    }>(d)
    expect(d).toEqual({ b: 1, d: 2, a: 3, c: 4 })
    expect(execOrder).toEqual(['b', 'd', 'a', 'c'])
  })

  it('correctly maps the returned properties to each task', async () => {
    const d = await auto({
      a: [() => 'str'],
      b: [() => 1],
      c: [() => true],
      d: [() => null],
      e: [() => undefined],
      f: [() => Symbol('sym')],
    })

    expectTypeOf(d).toMatchTypeOf<{
      a: string
      b: number
      c: boolean
      d: null
      e: undefined
      f: symbol
    }>()

    expect(d).toEqual({
      a: 'str',
      b: 1,
      c: true,
      d: null,
      e: undefined,
      f: expect.any(Symbol),
    })
  })

  it('can handle empty sets', async () => {
    const d = await auto({})

    expectTypeOf(d).toMatchTypeOf<Record<string, never>>()
    expect(d).toEqual({})
  })

  it('throws error on circular dependencies', async () => {
    expect(
      auto({
        a: ['b', () => {}],
        b: ['a', () => {}],
      }),
    ).rejects.toThrow(/circular dependency/i)
  })
})
