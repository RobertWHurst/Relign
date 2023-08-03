export type FunctionWithCallback<
  A extends [...any[], (err: any, ...args: any[]) => void],
> = (...args: A) => void
export type FunctionWithCallbackArgs<F extends (...args: any[]) => any> =
  Parameters<F> extends [...infer P, any] ? P : never
export type FunctionWithCallbackValues<F extends (...args: any[]) => any> =
  Parameters<F> extends [...any[], (err: any, ...values: infer V) => void]
    ? V extends [any, any, ...any[]]
      ? V
      : V extends [any]
      ? V[0]
      : void
    : never

export function cbToPromise<const F extends FunctionWithCallback<any>>(fn: F) {
  return async (
    ...args: FunctionWithCallbackArgs<F>
  ): Promise<FunctionWithCallbackValues<F>> => {
    const values = await new Promise<any>((resolve, reject) => {
      fn(...args, (err: any, ...values: any[]) => {
        if (err) return reject(err)
        resolve(values)
      })
    })
    if (values.length === 1) return values[0]
    if (values.length === 0) return undefined as any
    return values
  }
}
