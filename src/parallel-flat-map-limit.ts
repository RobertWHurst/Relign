import { Exec, exec, Executable } from './exec'

export type ParallelFlatMapItem<I> = I extends any[] ? I[number] : I[keyof I]

export type ParallelFlatLimitMapFn<I> = (
  item: ParallelFlatMapItem<I>,
  index: keyof I,
  items: I,
) => Executable<I extends any[] ? any[] : Record<string, any>>

export type ParallelFlatLimitMapValues<
  I,
  F extends ParallelFlatLimitMapFn<I>,
> = Exec<ReturnType<F>>

export async function parallelFlatMap<
  const I extends any[] | Record<string, any>,
  F extends ParallelFlatLimitMapFn<I>,
>(items: I, fn: F, limit: number) {
  const isArray = items instanceof Array

  const resultsArr: any[] = []
  const resultsMap = new Map<string, any>()

  const itemNamesOrIndexes = Object.keys(items)
  const pendingItemsNamesOrIndexes: string[] = []

  while (pendingItemsNamesOrIndexes.length !== limit) {
    const key = itemNamesOrIndexes.shift()
    if (!key) break
    pendingItemsNamesOrIndexes.push(key)
  }

  const processPendingItems = async () => {
    if (pendingItemsNamesOrIndexes.length === 0) return

    const runningItemsNamesOrIndexes = pendingItemsNamesOrIndexes.slice()
    pendingItemsNamesOrIndexes.length = 0

    await Promise.all(
      runningItemsNamesOrIndexes.splice(0).map(async (itemPropOrIndexStr) => {
        const item = items[itemPropOrIndexStr as keyof I]
        const itemPropOrIndex = isArray
          ? parseFloat(itemPropOrIndexStr)
          : itemPropOrIndexStr

        const result = (await exec(
          fn(item as ParallelFlatMapItem<I>, itemPropOrIndex as any, items),
        )) as any

        if (isArray) {
          resultsArr.push(...result)
        } else {
          for (const [key, value] of Object.entries(result)) {
            resultsMap.set(key, value)
          }
        }

        const key = itemNamesOrIndexes.shift()
        if (!key) return

        pendingItemsNamesOrIndexes.unshift(key)
        await processPendingItems()
      }),
    )
  }

  await processPendingItems()

  const results = isArray ? resultsArr : Object.fromEntries(resultsMap)

  return results as ParallelFlatLimitMapValues<I, F>
}
