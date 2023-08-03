import { describe, it, expect } from 'vitest'
import { setTimeout } from '../set-timeout'
import { vi } from 'vitest'

describe('setTimeout(fn() -> promise(val), duration) -> timeoutPromise(val)', () => {
  it('executes the fn once the duration elapses then resolves the value resolved by the fn', async () => {
    const executor = vi.fn(() => Promise.resolve('val'))

    vi.useFakeTimers()
    const promise = setTimeout(executor, 10).then((v) => `{${v}}`)
    vi.advanceTimersToNextTimer()
    vi.useRealTimers()
    const val = await promise

    expect(val).toBe('{val}')
  })
})

describe('setTimeout(fn() -> val, duration) -> timeoutPromise(val)', () => {
  it('executes the fn once the duration elapses then resolves the value returned by the fn', async () => {
    const executor = vi.fn(() => 'val')

    vi.useFakeTimers()
    const promise = setTimeout(executor, 10).then((v) => `{${v}}`)
    vi.advanceTimersToNextTimer()
    vi.useRealTimers()
    const val = await promise

    expect(val).toBe('{val}')
  })
})

describe('setTimeout(val, duration) -> timeoutPromise(val)', () => {
  it('resolves the value given after the duration elapses', async () => {
    vi.useFakeTimers()
    const promise = setTimeout('val', 10).then((v) => `{${v}}`)
    vi.advanceTimersToNextTimer()
    vi.useRealTimers()
    const val = await promise

    expect(val).toBe('{val}')
  })
})

describe('setTimeout(duration) -> timeoutPromise()', () => {
  it('resolves after the duration elapses', async () => {
    vi.useFakeTimers()
    const promise = setTimeout(10)
    vi.advanceTimersToNextTimer()
    vi.useRealTimers()
    const val = await promise

    expect(val).toBe(undefined)
  })
})

describe('new TimeoutPromise(fn, duration)', () => {
  describe('#clear(newVal) -> this', () => {
    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve newVal immediately', async () => {
      vi.useFakeTimers()
      const promise = setTimeout<string>('val', 10)
      promise.clear('newVal')
      vi.advanceTimersToNextTimer()
      vi.useRealTimers()

      const val = await promise

      expect(val).toBe('newVal')
    })
  })

  describe('#clear() -> this', () => {
    it('prevents the timeout fn from being called and causes the timeoutPromise to resolve immediately', async () => {
      vi.useFakeTimers()
      const promise = setTimeout('val', 10)
      promise.clear()
      vi.advanceTimersToNextTimer()
      vi.useRealTimers()

      const val = await promise

      expect(val).toBe(undefined)
    })
  })

  describe('#reset() -> this', () => {
    it('pospones the execution of the timeout fn', async () => {
      const cb = vi.fn((v) => v)

      const promise = setTimeout('val', 10).then(cb)
      promise.reset(20)

      await setTimeout(15)

      expect(cb).not.toBeCalled()

      await setTimeout(10)

      vi.useRealTimers()

      expect(cb).toBeCalled()
      expect(cb).toBeCalledWith('val')
    })
  })
})
