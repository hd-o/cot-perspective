import { config } from '@/model/config'

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
  document.getElementById('cotperspective').addEventListener('change', (event) => {
    if (event.target.className.includes('${config.dropdownClass}')) {
      window.cotperspective.assignLocation(event.target.value + '.html')
    }
  })
`
