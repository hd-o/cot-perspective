import React from 'react'
import { shallow, mount } from 'enzyme'
import { JSDOM } from 'jsdom'
import * as DropDowns from './PageDropDowns'
import { getTestData } from '../functions/getTestData'
import { getSortedKeys } from '../functions/getSortedKeys'
import { traderCategories } from '../data/traderCategories'
import { defaultSelections as selections } from '../data/defaultSelections'
import { COTData } from '../data/types'

const renderPageDropDowns = (testData: COTData) => (
  <DropDowns.PageDropDowns
    data={testData}
    exchanges={getSortedKeys(testData)}
    markets={getSortedKeys(testData[selections.exchange])}
    exchange={selections.exchange}
    market={selections.market}
    traderCategory={selections.traderCategory}
    traderCategories={traderCategories}
  />
)

/** Verify correct PageDropDowns rendering of test data */
test('PageDropDowns snapshot', async () => {
  const dropdowns = renderPageDropDowns(await getTestData())
  expect(shallow(dropdowns)).toMatchSnapshot()
})

/** Verify correct PageDropDowns navigation to selected page */
test('PageDropDowns navigation', async () => {
  // Component's <script> tag does not execute.
  // A new JSDOM instance is created to allow script execution
  const {
    window: { cotperspective, document, Event }
  } = new JSDOM(
    `<body>
      <div id='cotperspective'></div>
      <script>${DropDowns.pageSelectScript}</script>
    </body>`,
    {
      runScripts: 'dangerously',
      url: 'https://cotperspective.com'
    }
  )
  mount(renderPageDropDowns(await getTestData()), {
    attachTo: document.getElementById('cotperspective')
  })
  // Stub function that will be called on dropdown select
  cotperspective.assignLocation = jest.fn()
  // Get third dropdown, Trader Category
  const dropdowns = document.getElementsByClassName(DropDowns.$dropdown)
  const traderCategory = dropdowns[2] as HTMLSelectElement
  // Set trader category to EuroFX Commercial
  traderCategory.value = 'chicagomercantileexchangeeurofxcommercial'
  // Emit change event for page load
  traderCategory.dispatchEvent(new Event('change', { bubbles: true }))
  // Test if stub was called with page path
  expect(cotperspective.assignLocation).toHaveBeenLastCalledWith(
    DropDowns.pagePath(traderCategory.value)
  )
})
