import { FC } from 'react'

export const Header: FC = (props) => (
  <header className='blog-header py-3'>
    <div className='row flex-nowrap justify-content-between align-items-center'>
      {props.children}
    </div>
  </header>
)
