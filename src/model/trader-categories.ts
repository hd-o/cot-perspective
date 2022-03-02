/** COT categories */
export const traderCategories = ['Commercial', 'Noncommercial'] as const

export type TraderCategory = typeof traderCategories[number]

export type TraderCategories = readonly TraderCategory[]
