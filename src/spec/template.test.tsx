import renderer from 'react-test-renderer'
import { controller as ctrl } from '@/controller'
import { config } from '@/model/config'
import { Template } from '@/view/template'
import { testData } from './test-data'

test('template snapshot', async () => {
  const { data } = ctrl
  const marketsData = testData[config.defaultSelections.exchange]
  const marketData = marketsData[config.defaultSelections.market]
  const template = (
    <Template
      dropDownsData={{
        data: testData,
        exchanges: data.getSortedKeys(testData),
        markets: data.getSortedKeys(testData[config.defaultSelections.exchange]),
        traderCategories: config.traderCategories,
        ...config.defaultSelections,
      }}
      tableData={{
        averagePeriod: config.averagePeriod,
        values: marketData.map(
          data.processTableData(config.defaultSelections.traderCategory)
        ),
      }}
    />
  )
  expect(renderer.create(template).toJSON()).toMatchSnapshot()
})
