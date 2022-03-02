import { dropdownClass } from '../model/dropdown-classname'
import { pagePath } from './page-path'

declare global {
  interface Window {
    // Separate namespace to facilitate testing (using mocks)
    cotperspective: {
      assignLocation: typeof window.location.assign
    }
  }
}

/**
 * Handles page navigation after a dropdown option is selected.
 * Note: Might be refactored in the future if the site needs to
 * run React for more complex components, but at the moment this
 * fulfills the requirement while being a statically rendered site.
 */
export const pageSelectScript = `
  window.cotperspective = {
    assignLocation: window.location.assign.bind(window.location)
  }
  const pagePath = ${pagePath.toString()}
  document.getElementById('cotperspective').addEventListener('change', (event) => {
    if (event.target.className.includes('${dropdownClass}')) {
      window.cotperspective.assignLocation(pagePath(event.target.value))
    }
  })
`
