import { createContext, FC, useContext } from 'react'
import { LinkCtx } from './link'

interface UsefulLinkProps {
  channel: string
  link: string
  title: string
}

const UsefulLink: FC<UsefulLinkProps> = (props) => {
  const { link, title, channel } = props

  const Link = useContext(LinkCtx)

  return (
    <li className='useful-link'>
      <Link href={link} title={`${channel} - ${title}`}>
        <strong>{channel}</strong> - {title}
      </Link>
    </li>
  )
}

export const UsefulLinkCtx = createContext(UsefulLink)
