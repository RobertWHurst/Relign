import { Executable, exec } from './exec'

export type ParallelFindItems = any[] | Record<string, any>

export type ParallelFindItem<I> = I extends any[] ? I[number] : I[keyof I]

export type ParallelFindFn<I extends ParallelFindItems> = (
  item: ParallelFindItem<I>,
  key: keyof I,
  items: I,
) => Executable<boolean>

export async function parallelFind<I extends ParallelFindItems>(
  items: I,
  fn: ParallelFindFn<I>,
) {
  const isArray = items instanceof Array

  let hasFoundItem = false
  let resolveFound: (item: ParallelFindItem<I>) => void

  const foundPromise = new Promise<ParallelFindItem<I>>((r) => {
    resolveFound = r
  })

  const findPromise = Promise.all(
    Object.keys(items).map(async (itemPropOrIndexStr) => {
      if (hasFoundItem) return

      const item = items[itemPropOrIndexStr as keyof I] as ParallelFindItem<I>
      const itemPropOrIndex = isArray
        ? parseFloat(itemPropOrIndexStr)
        : itemPropOrIndexStr

      const isMatch = await exec(fn(item, itemPropOrIndex as any, items))
      if (hasFoundItem) return
      if (!isMatch) return

      hasFoundItem = true
      resolveFound(item)
    }),
  ).then(() => undefined)

  return await Promise.race([foundPromise, findPromise])
}
