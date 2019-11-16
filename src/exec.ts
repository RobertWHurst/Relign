export type Exec<V> = V extends () => PromiseLike<infer R>
  ? R
  : V extends () => infer R
  ? R
  : V extends PromiseLike<infer R>
  ? R
  : V

export type Executable<V> = (() => Promise<V>) | Promise<V> | (() => V) | V

export async function exec<const V>(value: V): Promise<Exec<V>> {
  return Promise.resolve(
    typeof value === 'function' ? value() : value,
  ) as Exec<V>
}
