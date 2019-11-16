import { Executable, exec } from './exec'

export type SeriesFilterItems = any[] | Record<string, any>

export type SeriesFilterItem<I> = I extends any[] ? I[number] : I[keyof I]

export type SeriesFilterFilteredItems<I extends SeriesFilterItems> =
  I extends any[] ? SeriesFilterItem<I>[] : Record<string, SeriesFilterItem<I>>

export type SeriesFilterFn<I extends SeriesFilterItems> = (
  item: SeriesFilterItem<I>,
  itemIndex: keyof I,
  items: I,
) => Executable<boolean>

export async function seriesFilter<I extends SeriesFilterItems>(
  items: I,
  fn: SeriesFilterFn<I>,
) {
  const filteredItems = (
    items instanceof Array ? [] : {}
  ) as SeriesFilterFilteredItems<I>

  for (const propOrIndexStr of Object.keys(items)) {
    const item = items[propOrIndexStr as keyof I] as SeriesFilterItem<I>
    const isArray = items instanceof Array
    const propOrIndex = isArray ? parseFloat(propOrIndexStr) : propOrIndexStr

    const isMatch = await exec(fn(item, propOrIndex as any, items))
    if (!isMatch) continue

    isArray
      ? filteredItems.push(item)
      : (filteredItems[propOrIndexStr as keyof SeriesFilterFilteredItems<I>] =
          item)
  }

  return filteredItems
}
