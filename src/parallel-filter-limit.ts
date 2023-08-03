import { Executable, exec } from './exec'
import { ParallelFilterFilteredItems } from './parallel-filter'

type ParallelFilterLimitItems = any[] | Record<string, any>

type ParallelFilterLimitItem<I> = I extends any[] ? I[number] : I[keyof I]

type ParallelFilterLimitFn<I extends ParallelFilterLimitItems> = (
  item: ParallelFilterLimitItem<I>,
  key: keyof I,
  items: I,
) => Executable<boolean>

export async function parallelFilterLimit<I extends ParallelFilterLimitItems>(
  items: I,
  fn: ParallelFilterLimitFn<I>,
  limit: number,
) {
  const isArray = items instanceof Array

  const filteredItems = (items instanceof Array ? [] : {}) as I extends any[]
    ? ParallelFilterLimitItem<I>[]
    : Record<string, ParallelFilterLimitItem<I>>

  const itemPropOrIndexes = Object.keys(items)
  const pendingItemPropOrIndexes: string[] = []

  while (pendingItemPropOrIndexes.length !== limit) {
    const key = itemPropOrIndexes.shift()
    if (!key) break
    pendingItemPropOrIndexes.push(key)
  }

  const processPendingItems = async () => {
    if (pendingItemPropOrIndexes.length === 0) return

    const inProgressItemNamesOrIndexes = pendingItemPropOrIndexes.slice()
    pendingItemPropOrIndexes.length = 0

    await Promise.all(
      inProgressItemNamesOrIndexes.splice(0).map(async (itemPropOrIndexStr) => {
        const item = items[
          itemPropOrIndexStr as keyof I
        ] as ParallelFilterLimitItem<I>
        const itemPropOrIndex = isArray
          ? parseFloat(itemPropOrIndexStr)
          : itemPropOrIndexStr

        const isMatch = await exec(fn(item, itemPropOrIndex as any, items))
        if (isMatch) {
          isArray
            ? filteredItems.push(item)
            : (filteredItems[
                itemPropOrIndexStr as keyof ParallelFilterFilteredItems<I>
              ] = item)
        }

        const key = itemPropOrIndexes.shift()
        if (!key) return

        pendingItemPropOrIndexes.unshift(key)
        await processPendingItems()
      }),
    )
  }

  await processPendingItems()

  return filteredItems
}
