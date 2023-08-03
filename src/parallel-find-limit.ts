import { Executable, exec } from './exec'

export type ParallelFindLimitItems = any[] | Record<string, any>

export type ParallelFindLimitItem<I> = I extends any[] ? I[number] : I[keyof I]

export type ParallelFindLimitFn<I extends ParallelFindLimitItems> = (
  item: ParallelFindLimitItem<I>,
  key: keyof I,
  items: I,
) => Executable<boolean>

export async function parallelFindLimit<I extends ParallelFindLimitItems>(
  items: I,
  fn: ParallelFindLimitFn<I>,
  limit: number,
) {
  const isArray = items instanceof Array

  let foundItem: ParallelFindLimitItem<I> | undefined

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
        if (foundItem) return

        const item = items[
          itemPropOrIndexStr as keyof I
        ] as ParallelFindLimitItem<I>
        const itemPropOrIndex = isArray
          ? parseFloat(itemPropOrIndexStr)
          : itemPropOrIndexStr

        const isMatch = await exec(fn(item, itemPropOrIndex as any, items))
        if (foundItem) return
        if (isMatch) {
          foundItem = item
          return
        }

        const key = itemPropOrIndexes.shift()
        if (!key) return

        pendingItemPropOrIndexes.unshift(key)
        await processPendingItems()
      }),
    )
  }

  await processPendingItems()

  return foundItem
}
