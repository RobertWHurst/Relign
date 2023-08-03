import { exec, Exec } from './exec'

const internalNextTick =
  typeof requestAnimationFrame === 'function'
    ? (r: () => void) => requestAnimationFrame(r)
    : (f: () => void) => setTimeout(f, 0)

export async function nextTick<V>(fn: V): Promise<Exec<V>>
export async function nextTick(): Promise<void>
export async function nextTick(x?: any) {
  return new Promise((resolve, reject) =>
    internalNextTick(() => exec(x).then(resolve).catch(reject)),
  )
}
