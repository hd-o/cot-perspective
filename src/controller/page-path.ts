import { Use } from './resolve-container'

type PagePath = (p: string) => string

export const useGetPagePath: Use<PagePath> = () => {
  return (page) => page + '.html'
}
