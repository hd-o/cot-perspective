import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { config } from '@/common/config'

type Props = PropsWithChildren<ComponentProps<'select'> & {
  defaultValue: string
}>

export function DropdownSelect(props: Props): ReactNode {
  const { defaultValue, ...selectProps } = props
  return (
    <select
      defaultValue={props.defaultValue}
      className={`custom-select form-control ${config.ui.dropdownClass}`}
      {...selectProps}
    >
      {props.children}
    </select>
  )
}
