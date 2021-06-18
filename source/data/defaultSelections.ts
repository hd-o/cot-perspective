import { DropDownSelections } from '../components/PageDropDowns'
import { traderCategories } from './traderCategories'

/** Index pages, or test default page selection */
export const defaultSelections: DropDownSelections = {
  exchange: 'CHICAGO MERCANTILE EXCHANGE',
  market: 'EURO FX',
  traderCategory: traderCategories[1]
}
