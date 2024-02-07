import renderer from 'react-test-renderer'
import { controller as ctrl } from '@/controller'
import { constants } from '@/model/constants'
import { Template } from '../src/view/template'
import { testData } from './test-data'

test('template snapshot', async () => {
  const { getSortedKeys, processTableData } = ctrl.data
  const marketsData = testData[constants.defaultSelections.exchange]
  const marketData = marketsData[constants.defaultSelections.market]
  const template = (
    <Template
      dropDownsData={{
        data: testData,
        exchanges: getSortedKeys(testData),
        markets: getSortedKeys(testData[constants.defaultSelections.exchange]),
        traderCategories: constants.traderCategories,
        ...constants.defaultSelections,
      }}
      tableData={{
        averagePeriod: constants.averagePeriod,
        values: marketData.map(
          processTableData(constants.defaultSelections.traderCategory)
        ),
      }}
    />
  )
  expect(renderer.create(template).toJSON()).toMatchSnapshot()
})
