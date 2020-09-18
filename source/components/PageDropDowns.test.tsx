import React from 'react'
import { PageDropDowns, pageSelectScript } from './PageDropDowns'
import { testData } from '../constants/testData'
import { getSortedKeys } from '../functions/getSortedKeys'
import { traderCategories } from '../constants/traderCategories'
import { selectedExchange, selectedMarket, selectedTraderCategory } from '../constants/defaultSelections'
import { shallow, mount } from 'enzyme'
import { JSDOM } from 'jsdom'

const renderPageDropDowns = () => <PageDropDowns
  data={testData}
  exchanges={getSortedKeys(testData)}
  markets={getSortedKeys(testData[selectedExchange])}
  selectedExchange={selectedExchange}
  selectedMarket={selectedMarket}
  selectedTraderCategory={selectedTraderCategory}
  traderCategories={traderCategories} />

/**
 * Verify correct PageDropDowns rendering of test data
 */
test('PageDropDowns snapshot', () => {
  expect(shallow(renderPageDropDowns())).toMatchSnapshot()
})

/**
 * Verify correct PageDropDowns navigation to selected page
 */
test('PageDropDowns navigation', () => {
  // Component's <script> tag does not execute.
  // A new JSDOM instance is created to allow script execution
  const { window } = new JSDOM(
    `<body>
      <div id='cotperspective'></div>
      <script>${pageSelectScript}</script>
    </body>`,
    {
      runScripts: 'dangerously',
      url: 'https://cotperspective.com'
    }
  )

  mount(renderPageDropDowns(), {
    attachTo: window.document.getElementById('cotperspective')
  })

  window.cotperspective.assignLocation = jest.fn()

  const traderCategorySelect = window.document.getElementsByClassName('js-page-dropdown-select')[2] as HTMLSelectElement
  traderCategorySelect.value = 'chicagomercantileexchangeeurofxcommercial'
  traderCategorySelect.dispatchEvent(new window.Event('change', { bubbles: true }))

  expect(window.cotperspective.assignLocation)
    .toHaveBeenLastCalledWith(traderCategorySelect.value + '.html')
})
