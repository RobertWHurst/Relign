import { exec, Exec } from './exec'

export type SeriesMapItemIndex<I> = I extends any[] ? number : keyof I

export type SeriesMapItem<I> = I extends any[] ? I[number] : I[keyof I]

export type SeriesMapFn<I> = (
  item: SeriesMapItem<I>,
  index: SeriesMapItemIndex<I>,
  items: I,
) => any

export type SeriesMapValues<I, F extends SeriesMapFn<I>> = I extends any[]
  ? { -readonly [II in keyof I]: Exec<ReturnType<F>> }
  : I extends Record<string, any>
  ? { -readonly [II in keyof I]: Exec<ReturnType<F>> }
  : never

export async function seriesMap<
  const I extends any[] | Record<string, any>,
  F extends SeriesMapFn<I>,
>(items: I, fn: F) {
  const isArray = items instanceof Array

  const resultsMap = new Map<string, any>()

  const itemIndexesOrProps = Object.keys(items)
  for (let i = 0; i < itemIndexesOrProps.length; i += 1) {
    const itemPropOrIndexStr = itemIndexesOrProps[i]
    const item = items[itemPropOrIndexStr as keyof I]
    const itemPropOrIndex = isArray ? i : itemPropOrIndexStr
    const result = await exec(
      fn(item as SeriesMapItem<I>, itemPropOrIndex as any, items),
    )
    resultsMap.set(itemPropOrIndexStr, result)
  }

  const results = isArray
    ? Array.from(resultsMap.values())
    : Object.fromEntries(resultsMap)

  return results as SeriesMapValues<I, F>
}
