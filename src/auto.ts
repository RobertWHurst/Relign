import { exec, Exec } from './exec'

export type AutoTasks = {
  [key: string]: [...string[], (tasks?: AutoTaskValues<any>) => any]
}
export type AutoTaskFn<T extends any[]> = T extends [...string[], infer F]
  ? F
  : never
export type AutoTaskValue<T extends any[]> = Exec<AutoTaskFn<T>>
export type AutoTaskValues<T extends AutoTasks> = {
  [K in keyof T]: AutoTaskValue<T[K]>
}

type TaskMeta = {
  dependencies: Set<string>
  fn: (tasks?: AutoTaskValues<any>) => any
}

export async function auto<T extends AutoTasks>(tasks: T) {
  const tasksMap = new Map<string, TaskMeta>()

  for (const taskName in tasks) {
    const dependenciesArr = tasks[taskName].slice()
    const fn = dependenciesArr.pop() as () => any
    const dependencies = new Set(dependenciesArr as string[])
    tasksMap.set(taskName, { dependencies, fn })
  }

  for (const [taskName, { dependencies }] of tasksMap.entries()) {
    for (const dependencyName of dependencies) {
      const dependencyTaskMeta = tasksMap.get(dependencyName)
      if (!dependencyTaskMeta)
        throw new Error(
          `The task ${taskName} is depends upon a task named ${dependencyName}, ` +
            `but ${dependencyName} does not exist`,
        )
      if (dependencyTaskMeta.dependencies.has(taskName))
        throw new Error(
          `${taskName} has a circular dependency on ${dependencyName}`,
        )
    }
  }

  const results = {} as AutoTaskValues<T>

  const runPendingTasks = async () => {
    let hasExecutedTask = false
    for (const [taskName, { dependencies, fn }] of tasksMap.entries()) {
      if (dependencies.size !== 0) continue

      tasksMap.delete(taskName)
      results[taskName as keyof AutoTaskValues<T>] = await exec<any>(() => {
        if (typeof fn === 'function') return fn(results)
        return fn
      })
      hasExecutedTask = true

      for (const task of tasksMap.values()) {
        task.dependencies.delete(taskName)
      }
    }

    if (tasksMap.size === 0) return
    if (!hasExecutedTask)
      throw new Error(
        'There are still tasks remaining, but none of them can be executed. ' +
          'Check for incorrect dependencies.',
      )

    await runPendingTasks()
  }

  await runPendingTasks()

  return results
}
