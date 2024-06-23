import { createContext, useContext } from 'react'
import { controller } from '@/controller'

const ControllerContext = createContext(controller)

export function useController () {
  return useContext(ControllerContext) ?? controller
}
