import { Container } from 'inversify'
import { createContext } from 'react'

export const container = new Container()
export const ContainerCtx = createContext(container)
