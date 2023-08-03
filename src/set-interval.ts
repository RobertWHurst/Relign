import { exec, Exec } from './exec'

export interface IntervalData {
  resolve: (val?: any) => void
  reject: (reason?: any) => void
  duration: number
  intervalHandler: () => void
  intervalId: NodeJS.Timeout
}

export class IntervalPromise<V> implements Promise<V> {
  _promise: Promise<V>
  _intervalData!: IntervalData

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
  ): IntervalPromise<V1 | V2> {
    const p = new IntervalPromise(this._promise.then(onfulfilled, onrejected))
    p._intervalData = this._intervalData
    return p
  }

  catch<VV = never>(
    onrejected?: ((reason: any) => VV | PromiseLike<VV>) | undefined | null,
  ): IntervalPromise<V | VV> {
    const p = new IntervalPromise(this._promise.catch(onrejected))
    p._intervalData = this._intervalData
    return p
  }

  finally(onfinally?: (() => void) | undefined | null): IntervalPromise<V> {
    const p = new IntervalPromise<V>(this._promise.finally(onfinally))
    p._intervalData = this._intervalData
    return p
  }

  reset(duration?: number): this {
    clearInterval(this._intervalData.intervalId)
    this._intervalData.intervalId = global.setInterval(
      this._intervalData.intervalHandler,
      duration !== undefined ? duration : this._intervalData.duration,
    )
    return this
  }

  clear(fn?: Exec<V>): this {
    clearInterval(this._intervalData.intervalId)
    exec(fn as any)
      .then(this._intervalData.resolve)
      .catch(this._intervalData.reject)
    return this
  }

  [Symbol.toStringTag] = 'Promise'
}

export function setInterval<V>(
  fn: (resolve: (value?: V | PromiseLike<V> | undefined) => void) => void,
  duration: number,
): IntervalPromise<V> {
  let intervalData: IntervalData
  const intervalPromise = new IntervalPromise<V>((resolve, reject) => {
    // looks like eslint perfer-const rule is broken here. It doesn't notice the reassignment.
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout
    const intervalHandler = () => {
      try {
        fn.call(intervalPromise, resolve)
      } catch (err) {
        clearInterval(intervalId)
        reject(err)
      }
    }
    intervalId = global.setInterval(intervalHandler, duration as number)
    intervalData = {
      resolve,
      reject,
      intervalHandler,
      intervalId,
      duration: duration as number,
    }
  })
  intervalPromise._intervalData = intervalData!

  return intervalPromise
}
