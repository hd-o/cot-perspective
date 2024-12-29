import type { PropsWithChildren, ReactNode } from 'react'

export function Header(props: PropsWithChildren): ReactNode {
  return (
    <header className="blog-header py-3">
      <div className="row flex-nowrap justify-content-between align-items-center">
        {props.children}
      </div>
    </header>
  )
}
