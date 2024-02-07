import { FC } from 'react'
import { constants } from '@/model/constants'

interface Props {
  defaultValue: string
}

export const DropdownSelect: FC<Props> = (props) => {
  return (
    <select
      defaultValue={props.defaultValue}
      className={`custom-select form-control ${constants.dropdownClass}`}>
      {props.children}
    </select>
  )
}
