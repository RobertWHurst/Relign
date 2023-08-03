import { Executable, exec } from './exec'

export type SeriesFindItems = any[] | Record<string, any>

export type SeriesFindItem<I> = I extends any[] ? I[number] : I[keyof I]

export type SeriesFindFn<I extends SeriesFindItems> = (
  item: SeriesFindItem<I>,
  key: keyof I,
  items: I,
) => Executable<boolean>

export async function seriesFind<I extends SeriesFindItems>(
  items: I,
  fn: SeriesFindFn<I>,
) {
  for (const propOrIndexStr of Object.keys(items)) {
    const item = items[propOrIndexStr as keyof I] as SeriesFindItem<I>
    const isArray = items instanceof Array
    const propOrIndex = isArray ? parseFloat(propOrIndexStr) : propOrIndexStr

    const isMatch = await exec(fn(item, propOrIndex as any, items))
    if (isMatch) return item
  }

  return undefined
}
