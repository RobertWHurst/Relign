import { exec } from './exec'
import {
  ParallelMapFn,
  ParallelMapItem,
  ParallelMapValues,
} from './parallel-map'

export async function parallelMapLimit<
  const I extends any[] | Record<string, any>,
  F extends ParallelMapFn<I>,
>(items: I, fn: F, limit: number) {
  const isArray = items instanceof Array

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
        const item = items[itemPropOrIndexStr as keyof I] as ParallelMapItem<I>
        const itemPropOrIndex = isArray
          ? parseFloat(itemPropOrIndexStr)
          : itemPropOrIndexStr

        const result = await exec(fn(item, itemPropOrIndex as any, items))
        resultsMap.set(itemPropOrIndexStr, result)

        const key = itemNamesOrIndexes.shift()
        if (!key) return

        pendingItemsNamesOrIndexes.unshift(key)
        await processPendingItems()
      }),
    )
  }

  await processPendingItems()

  const results = isArray
    ? Array.from(resultsMap.values())
    : Object.fromEntries(resultsMap)

  return results as ParallelMapValues<I, F>
}
