import type { HTMLProps, ReactNode } from 'react'

export function Link(props: HTMLProps<HTMLAnchorElement>): ReactNode {
  return (
    <a
      href={props.href}
      title={props.title}
      className="text-dark"
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  )
}
