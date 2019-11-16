import { describe, it, expect } from 'vitest'
import { setInterval } from '../set-interval'

describe('setInterval(fn() -> promise(result)) -> intervalPromise(result)', () => {
  it('executes the passed function each time the interval elapses until cleared', () => {
    let i = 0
    const intervalPromise = setInterval<string>(() => {
      i += 1
      if (i === 3) {
        intervalPromise.clear('value')
      }
    }, 0)
    return intervalPromise.then((value) => expect(value).toBe('value'))
  })
})

describe('new IntervalPromise(fn, duration) -> this', () => {
  describe('#clear(val)', () => {
    it('causes the intervalPromise to resolve', () =>
      setInterval<string>(() => {}, 0)
        .clear('value')
        .then((value) => expect(value).toBe('value')))
  })
})
