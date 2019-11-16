import { exec } from './exec'
import { ParallelTaskValues } from './parallel'

export async function parallelLimit<
  const T extends any[] | Record<string, any>,
>(tasks: T, limit: number) {
  const resultsMap = new Map<string, any>()

  const taskNamesOrIndexes = Object.keys(tasks)
  const pendingTaskNamesOrIndexes: string[] = []

  while (pendingTaskNamesOrIndexes.length !== limit) {
    const key = taskNamesOrIndexes.shift()
    if (!key) break
    pendingTaskNamesOrIndexes.push(key)
  }

  const runPendingTasks = async () => {
    if (pendingTaskNamesOrIndexes.length === 0) return

    const runningTaskNamesOrIndexes = pendingTaskNamesOrIndexes.slice()
    pendingTaskNamesOrIndexes.length = 0

    await Promise.all(
      runningTaskNamesOrIndexes.splice(0).map(async (taskNameOrIndex) => {
        const task = tasks[taskNameOrIndex as keyof T]
        const result = await exec(task)
        resultsMap.set(taskNameOrIndex, result)

        const key = taskNamesOrIndexes.shift()
        if (!key) return

        pendingTaskNamesOrIndexes.unshift(key)
        await runPendingTasks()
      }),
    )
  }

  await runPendingTasks()

  const results =
    tasks instanceof Array
      ? Array.from(resultsMap.values())
      : Object.fromEntries(resultsMap)

  return results as ParallelTaskValues<T>
}
