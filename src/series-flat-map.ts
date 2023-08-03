import { Executable, exec } from './exec'

export type SeriesFlatMapItems = any[] | Record<string, any>

export type SeriesFlatMapItem<I> = I extends any[] ? I[number] : I[keyof I]

export type SeriesFlatMappedItems<I extends SeriesFlatMapItems> =
  I extends any[]
    ? SeriesFlatMapItem<I>[]
    : Record<string, SeriesFlatMapItem<I>>

export type SeriesFlatMapFn<I extends SeriesFlatMapItems> = (
  item: SeriesFlatMapItem<I>,
  itemIndex: keyof I,
  items: I,
) => Executable<SeriesFlatMappedItems<I>>

export async function seriesFlatMap<I extends SeriesFlatMapItems>(
  items: I,
  fn: SeriesFlatMapFn<I>,
) {
  const isArray = items instanceof Array

  const resultsArr: any[] = []
  const resultsMap = new Map<string, any>()

  for (const propOrIndexStr of Object.keys(items)) {
    const item = items[propOrIndexStr as keyof I] as SeriesFlatMapItem<I>
    const propOrIndex = isArray ? parseFloat(propOrIndexStr) : propOrIndexStr

    const result = (await exec(fn(item, propOrIndex as any, items))) as any

    if (isArray) {
      resultsArr.push(...result)
    } else {
      for (const [key, value] of Object.entries(result)) {
        resultsMap.set(key, value)
      }
    }
  }

  return (
    isArray ? resultsArr : Object.fromEntries(resultsMap)
  ) as SeriesFlatMappedItems<I>
}
