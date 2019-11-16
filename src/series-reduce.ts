import { exec, Exec } from './exec'

export function seriesReduce<V, M, R extends Exec<M>>(
  items: V[],
  fn: (
    previousValue: R,
    currentValue: V,
    currentIndex: number,
    items: V[],
  ) => M,
  initialValue?: R,
): Promise<R>
export function seriesReduce<V, M, R extends Exec<M>>(
  items: { [s: string]: V },
  fn: (
    previousValue: R,
    currentValue: V,
    currentIndex: string,
    items: { [s: string]: V },
  ) => M,
  initialValue?: R,
): Promise<R>
export function seriesReduce(
  items: any,
  fn: (
    previousValue: any,
    currentValue: any,
    currentIndex: any,
    items: any,
  ) => any,
  initialValue: any,
): Promise<any> {
  const isArray = typeof items.length === 'number'
  const props = isArray
    ? items.map((_: any, i: number) => i)
    : Object.keys(items)
  const tasks: any = isArray ? [] : {}
  for (const prop of props) {
    tasks[prop] = (previousValue: any) =>
      fn(previousValue, items[prop], prop, items)
  }
  let i = 0
  let result = initialValue
  const rec = (): Promise<any> => {
    const prop = props[i++]
    const fn = tasks[prop]
    return prop !== undefined
      ? exec(fn(result))
          .then((v) => {
            result = v
          })
          .then(rec)
      : Promise.resolve(result)
  }
  return rec()
}

export default seriesReduce
