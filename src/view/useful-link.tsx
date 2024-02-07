import { FC } from 'react'
import { Link } from './link'

interface UsefulLinkProps {
  channel: string
  link: string
  title: string
}

export const UsefulLink: FC<UsefulLinkProps> = (props) => {
  return (
    <li className='useful-link'>
      <Link href={props.link} title={`${props.channel} - ${props.title}`}>
        <strong>{props.channel}</strong> - {props.title}
      </Link>
    </li>
  )
}
