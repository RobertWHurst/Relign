export type ParallelFilterItems = any[] | Record<string, any>

export type ParallelFilterItem<I> = I extends any[] ? I[number] : I[keyof I]

export type ParallelFilterFilteredItems<I extends ParallelFilterItems> =
  I extends any[]
    ? ParallelFilterItem<I>[]
    : Record<string, ParallelFilterItem<I>>

export async function parallelFilter<I extends ParallelFilterItems>(
  items: I,
  fn: (item: ParallelFilterItem<I>, itemIndex: keyof I, items: I) => boolean,
) {
  const filteredItems = (
    items instanceof Array ? [] : {}
  ) as ParallelFilterFilteredItems<I>

  const promises = Object.keys(items).map(async (propOrIndexStr) => {
    const item = items[propOrIndexStr as keyof I] as ParallelFilterItem<I>
    const isArray = items instanceof Array
    const propOrIndex = isArray ? parseFloat(propOrIndexStr) : propOrIndexStr

    const isMatch = await fn(item, propOrIndex as any, items)
    if (!isMatch) return

    isArray
      ? filteredItems.push(item)
      : (filteredItems[propOrIndexStr as keyof ParallelFilterFilteredItems<I>] =
          item)
  })

  await Promise.all(promises)

  return filteredItems
}
