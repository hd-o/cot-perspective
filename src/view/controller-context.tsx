import type { Controller } from '@/controller'
import { createContext, useContext } from 'react'

export const ControllerContext = createContext({} as Controller)

export function useController() {
  return useContext(ControllerContext)
}
