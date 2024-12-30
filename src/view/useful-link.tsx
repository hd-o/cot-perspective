import type { ReactNode } from 'react'
import { Link } from './link'

type UsefulLinkProps = {
  channel: string
  link: string
  title: string
}

export function UsefulLink(props: UsefulLinkProps): ReactNode {
  return (
    <li className="useful-link">
      <Link href={props.link} title={`${props.channel} - ${props.title}`}>
        <strong>{props.channel}</strong>
        {` - ${props.title}`}
      </Link>
    </li>
  )
}
