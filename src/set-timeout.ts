import { exec, Exec } from './exec'

export interface TimeoutData {
  resolve: (val?: any) => void
  reject: (reason?: any) => void
  duration: number
  timeoutHandler: () => void
  timeoutId: NodeJS.Timeout
}

export class TimeoutPromise<V> implements Promise<V> {
  _promise: Promise<V>
  _timeoutData!: TimeoutData

  constructor(promise: Promise<V>)
  constructor(
    executor: (
      resolve: (value?: V | PromiseLike<V>) => void,
      reject: (reason?: any) => void,
    ) => void,
  )
  constructor(executorOrPromise: any) {
    this._promise =
      executorOrPromise instanceof Promise
        ? executorOrPromise
        : new Promise(executorOrPromise)
  }

  then<V1 = V, V2 = never>(
    onfulfilled?: ((value: V) => V1 | PromiseLike<V1>) | undefined | null,
    onrejected?: ((reason: any) => V2 | PromiseLike<V2>) | undefined | null,
  ): TimeoutPromise<V1 | V2> {
    const p = new TimeoutPromise(this._promise.then(onfulfilled, onrejected))
    p._timeoutData = this._timeoutData
    return p
  }

  catch<VV = never>(
    onrejected?: ((reason: any) => VV | PromiseLike<VV>) | undefined | null,
  ): TimeoutPromise<V | VV> {
    const p = new TimeoutPromise(this._promise.catch(onrejected))
    p._timeoutData = this._timeoutData
    return p
  }

  finally(onfinally?: (() => void) | undefined | null): TimeoutPromise<V> {
    const p = new TimeoutPromise(this._promise.finally(onfinally))
    p._timeoutData = this._timeoutData
    return p
  }

  reset(duration?: number): this {
    clearTimeout(this._timeoutData.timeoutId)
    this._timeoutData.timeoutId = global.setTimeout(
      this._timeoutData.timeoutHandler,
      duration !== undefined ? duration : this._timeoutData.duration,
    )
    return this
  }

  clear(fn?: Exec<V>): this {
    clearTimeout(this._timeoutData.timeoutId)
    exec(fn as any)
      .then(this._timeoutData.resolve)
      .catch(this._timeoutData.reject)
    return this
  }

  [Symbol.toStringTag] = 'Promise'
}

export function setTimeout(duration: number): TimeoutPromise<void>
export function setTimeout<const V>(
  x: V,
  duration: number,
): TimeoutPromise<Exec<V>>
export function setTimeout(x?: any, duration?: number): TimeoutPromise<any> {
  if (duration === undefined && typeof x === 'number') {
    duration = x
    x = undefined
  }
  let timeoutData: TimeoutData
  const timeoutPromise = new TimeoutPromise((resolve, reject) => {
    const timeoutHandler = () => {
      exec(x).then(resolve).catch(reject)
    }
    timeoutData = {
      resolve,
      reject,
      timeoutHandler,
      timeoutId: global.setTimeout(timeoutHandler, duration as number),
      duration: duration as number,
    }
  })
  timeoutPromise._timeoutData = timeoutData!
  return timeoutPromise
}
