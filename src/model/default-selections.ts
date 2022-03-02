import { DropDownSelections } from '../view/page-dropdowns'
import { traderCategories } from './trader-categories'

/** Index pages, or test default page selection */
export const defaultSelections: DropDownSelections = {
  exchange: 'CHICAGO MERCANTILE EXCHANGE',
  market: 'EURO FX',
  traderCategory: traderCategories[1]
}
