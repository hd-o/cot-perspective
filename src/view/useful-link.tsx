import { createContext, FC, useContext } from 'react'
import { LinkCtx } from './link'

interface UsefulLinkProps {
  channel: string
  link: string
  title: string
}

const UsefulLink: FC<UsefulLinkProps> = (props) => {
  const Link = useContext(LinkCtx)

  return (
    <li className='useful-link'>
      <Link href={props.link} title={`${props.channel} - ${props.title}`}>
        <strong>{props.channel}</strong> - {props.title}
      </Link>
    </li>
  )
}

export const UsefulLinkCtx = createContext(UsefulLink)
