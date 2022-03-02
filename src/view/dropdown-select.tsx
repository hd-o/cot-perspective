import { createContext, FC } from 'react'
import { dropdownClass } from '../model/dropdown-classname'

interface Props {
  defaultValue: string
}

const DropdownSelect: FC<Props> = (props) => {
  return (
    <select
      defaultValue={props.defaultValue}
      className={`custom-select form-control ${dropdownClass}`}>
      {props.children}
    </select>
  )
}

export const DropdownSelectCtx = createContext(DropdownSelect)
