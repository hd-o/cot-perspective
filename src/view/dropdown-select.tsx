import { FC } from 'react'
import { config } from '@/model/config'

interface DropdownSelectProps {
  defaultValue: string
}

export const DropdownSelect: FC<DropdownSelectProps> = function (props) {
  return (
    <select
      defaultValue={props.defaultValue}
      className={`custom-select form-control ${config.dropdownClass}`}>
      {props.children}
    </select>
  )
}
