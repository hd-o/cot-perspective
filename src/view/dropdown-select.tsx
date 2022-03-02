import { createContext, FC } from 'react'
import { dropdownClass } from '../model/dropdown-classname'

interface Props {
  defaultValue: string
}

const DropdownSelect: FC<Props> = (props) => {
  const { children, defaultValue } = props
  return (
    <select
      defaultValue={defaultValue}
      className={`custom-select form-control ${dropdownClass}`}>
      {children}
    </select>
  )
}

export const DropdownSelectCtx = createContext(DropdownSelect)
