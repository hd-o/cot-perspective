import antfu from '@antfu/eslint-config'

export default antfu({}, {
  files: ['package.json'],
  rules: {
    'jsonc/sort-keys': 'off',
  },
})
