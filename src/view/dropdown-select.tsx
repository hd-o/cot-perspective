import type { PropsWithChildren, ReactNode } from 'react'
import { config } from '@/common/config'

type DropdownSelectProps = PropsWithChildren<{
  defaultValue: string
}>

export function DropdownSelect(props: DropdownSelectProps): ReactNode {
  return (
    <select
      defaultValue={props.defaultValue}
      className={`custom-select form-control ${config.dropdownClass}`}
    >
      {props.children}
    </select>
  )
}
