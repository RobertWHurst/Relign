import { Exec, exec, Executable } from './exec'
import { ParallelMapItem } from './parallel-map'

export type ParallelFlatMapFn<I> = (
  item: ParallelMapItem<I>,
  index: keyof I,
  items: I,
) => Executable<I extends any[] ? any[] : Record<string, any>>

export type ParallelFlatMapValues<I, F extends ParallelFlatMapFn<I>> = Exec<
  ReturnType<F>
>

export async function parallelFlatMap<
  const I extends any[] | Record<string, any>,
  F extends ParallelFlatMapFn<I>,
>(items: I, fn: F) {
  const isArray = items instanceof Array

  const resultsArr: any[] = []
  const resultsMap = new Map<string, any>()

  await Promise.all(
    Object.keys(items).map(async (itemPropOrIndexStr) => {
      const item = items[itemPropOrIndexStr as keyof I]
      const itemPropOrIndex = isArray
        ? parseFloat(itemPropOrIndexStr)
        : itemPropOrIndexStr
      const result = (await exec(
        fn(item as ParallelMapItem<I>, itemPropOrIndex as any, items),
      )) as any

      if (isArray) {
        resultsArr.push(...result)
      } else {
        for (const [key, value] of Object.entries(result)) {
          resultsMap.set(key, value)
        }
      }
    }),
  )

  return (
    isArray ? resultsArr : Object.fromEntries(resultsMap)
  ) as ParallelFlatMapValues<I, F>
}
