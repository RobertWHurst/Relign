import { exec, Exec } from './exec'

export type ParallelMapItem<I> = I extends any[] ? I[number] : I[keyof I]

export type ParallelMapFn<I> = (
  item: ParallelMapItem<I>,
  index: keyof I,
  items: I,
) => any

export type ParallelMapValues<I, F extends ParallelMapFn<I>> = I extends any[]
  ? { -readonly [II in keyof I]: Exec<ReturnType<F>> }
  : I extends Record<string, any>
  ? { -readonly [II in keyof I]: Exec<ReturnType<F>> }
  : never

export async function parallelMap<
  const I extends any[] | Record<string, any>,
  F extends ParallelMapFn<I>,
>(items: I, fn: F) {
  const isArray = items instanceof Array

  const resultsMap = new Map<string, any>()

  await Promise.all(
    Object.keys(items).map(async (itemPropOrIndexStr) => {
      const item = items[itemPropOrIndexStr as keyof I]
      const itemPropOrIndex = isArray
        ? parseFloat(itemPropOrIndexStr)
        : itemPropOrIndexStr
      const result = await exec(
        fn(item as ParallelMapItem<I>, itemPropOrIndex as any, items),
      )
      resultsMap.set(itemPropOrIndexStr, result)
    }),
  )

  const results = isArray
    ? Array.from(resultsMap.values())
    : Object.fromEntries(resultsMap)

  return results as ParallelMapValues<I, F>
}
