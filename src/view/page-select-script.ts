import { config } from '@/common/config'

function initPageSelector() {
  document.getElementById('{containerId}')?.addEventListener('change', (event): void => {
    if (event.target instanceof HTMLSelectElement) {
      if (event.target.className.includes('{dropdownClass}')) {
        window.location.assign(`${event.target.value}.html`)
      }
    }
  })
}

/**
 * Handles page navigation after a dropdown option is selected.
 * Note: Might be refactored in the future if the site needs to
 * run React for more complex components, but at the moment this
 * fulfills the requirement while being a statically rendered site.
 */
export const pageSelectScript = `(${initPageSelector})()`
  .replace('{containerId}', config.ui.containerId)
  .replace('{dropdownClass}', config.ui.dropdownClass)
