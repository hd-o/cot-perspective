import { useContext } from 'react'
import { ContainerCtx } from './container'
import { resolve, Use } from './resolve-container'

type UseResolve = <F extends Use<any>> (f: F) => ReturnType<F>

export const useResolve: UseResolve = (fn) => {
  const container = useContext(ContainerCtx)
  return resolve(container)(fn)
}
