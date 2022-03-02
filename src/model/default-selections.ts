import { traderCategories, TraderCategory } from './trader-categories'

export interface DropDownSelections {
  exchange: string
  market: string
  traderCategory: TraderCategory
}

/** Index pages, or test default page selection */
export const defaultSelections: DropDownSelections = {
  exchange: 'CHICAGO MERCANTILE EXCHANGE',
  market: 'EURO FX',
  traderCategory: traderCategories[1],
}
