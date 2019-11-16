import { exec, Exec } from './exec'

export type SeriesTaskValues<T> = T extends any[]
  ? { -readonly [I in keyof T]: Exec<T[I]> }
  : T extends Record<string, any>
  ? { -readonly [K in keyof T]: Exec<T[K]> }
  : never

export async function series<const T extends any[] | Record<string, any>>(
  tasks: T,
) {
  const resultsMap = new Map<string, any>()

  for (const taskNameOrIndex in tasks) {
    const task = tasks[taskNameOrIndex as keyof T]
    const result = await exec(task)
    resultsMap.set(taskNameOrIndex, result)
  }

  const results =
    tasks instanceof Array
      ? Array.from(resultsMap.values())
      : Object.fromEntries(resultsMap)

  return results as SeriesTaskValues<T>
}
