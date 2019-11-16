import { exec, Exec } from './exec'

export async function nextTick<V>(fn: V): Promise<Exec<V>>
export async function nextTick(): Promise<void>
export async function nextTick(x?: any) {
  return new Promise((resolve, reject) =>
    process.nextTick(() => exec(x).then(resolve).catch(reject)),
  )
}
