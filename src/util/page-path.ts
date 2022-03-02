type PagePath = (p: string) => string

export const pagePath: PagePath = (page) => page + '.html'
