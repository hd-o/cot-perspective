import { expect, test } from '@playwright/test'

test('navigation', async ({ page }) => {
  await page.goto('/')
  const header = page.getByText('COT Perspective', { exact: true })
  await expect(header).toBeVisible()
  await expect(page).toHaveScreenshot('home')

  const select = page.getByLabel('Market')
  const selected = select.locator('option[selected]')
  await expect(selected).toHaveText('EURO FX')
  await select.selectOption({ label: 'BITCOIN' })

  await page.waitForURL(/.+bitcoin.+/)
  await expect(page).toHaveScreenshot('bitcoin')
})
