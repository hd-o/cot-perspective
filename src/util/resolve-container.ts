import { Container } from 'inversify'

export const container = new Container()

export type Use <V> = (r: ReturnType<Resolve>, c: Container) => V

type Resolve = (c: Container) => <F extends Use<any>> (f: F) => ReturnType<F>

export const resolve: Resolve = (c = container) => (fn) => {
  if (c.isBound(fn)) return c.get(fn)
  c.bind(fn).toConstantValue(fn(resolve(c), c))
  return c.get(fn)
}
