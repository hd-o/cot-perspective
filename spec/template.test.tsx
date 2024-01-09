import { container } from '../src/controller/container'
import { resolve as resolveWith } from '../src/controller/resolve-container'
import { shallow } from 'enzyme'
import { averagePeriod } from '../src/model/average-period'
import { defaultSelections } from '../src/model/default-selections'
import { traderCategories } from '../src/model/trader-categories'
import { useGetSortedKeys } from '../src/controller/get-sorted-keys'
import { useGetTestData } from '../src/controller/get-test-data'
import { useProcessTableData } from '../src/controller/process-table-data'
import { Template } from '../src/view/template'

const resolve = resolveWith(container)

/** Verify correct Template rendering of test data */
test('Template snapshot', async () => {
  const getSortedKeys = resolve(useGetSortedKeys)
  const processTableData = resolve(useProcessTableData)
  const testData = await resolve(useGetTestData)()

  const marketsData = testData[defaultSelections.exchange]
  const marketData = marketsData[defaultSelections.market]

  const template = (
    <Template
      dropDownsData={{
        data: testData,
        exchanges: getSortedKeys(testData),
        markets: getSortedKeys(testData[defaultSelections.exchange]),
        traderCategories,
        ...defaultSelections,
      }}
      tableData={{
        averagePeriod,
        values: marketData.map(
          processTableData(defaultSelections.traderCategory)
        ),
      }}
    />
  )

  expect(shallow(template)).toMatchSnapshot()
})
