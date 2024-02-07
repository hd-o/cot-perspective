import { FC, HTMLProps } from 'react'

export const Link: FC<HTMLProps<HTMLAnchorElement>> = (props) => (
  <a
    href={props.href}
    title={props.title}
    className='text-dark'
    target='_blank'
    rel='noopener noreferrer'
  >
    {props.children}
  </a>
)
