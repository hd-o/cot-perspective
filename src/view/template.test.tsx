import { config } from '@/common/config'
import { Controller } from '@/controller'
import { ControllerContext } from '@/view/controller-context'
import { Template } from '@/view/template'
import renderer from 'react-test-renderer'
import { cotData } from '../model/mocks'

it('template snapshot', async () => {
  const ctrl = new Controller()
  const marketsData = cotData[config.defaultSelections.exchange]
  const marketData = marketsData[config.defaultSelections.market]
  const template = (
    <ControllerContext value={ctrl}>
      <Template
        dropDownsData={{
          data: cotData,
          exchanges: ctrl.data.getSortedKeys(cotData),
          markets: ctrl.data.getSortedKeys(cotData[config.defaultSelections.exchange]),
          traderCategories: config.traderCategories,
          ...config.defaultSelections,
        }}
        tableData={{
          averagePeriod: config.averagePeriod,
          values: marketData.map(
            ctrl.data.processTableData(config.defaultSelections.traderCategory),
          ),
        }}
      />
    </ControllerContext>
  )
  expect(renderer.create(template).toJSON()).toMatchSnapshot()
})
