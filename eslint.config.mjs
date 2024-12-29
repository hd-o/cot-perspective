import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'ts/consistent-type-definitions': [
      'error',
      'type',
    ],
    // Allow types with the same name as its value
    'ts/no-redeclare': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
}, {
  files: ['package.json'],
  rules: {
    'jsonc/sort-keys': 'off',
  },
})
