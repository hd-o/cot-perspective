import antfu from '@antfu/eslint-config'

export default antfu({}, {
  files: ['**/*.mjs', '**/*.ts', '**/*.tsx'],
  rules: {
    'accessor-pairs': 'off',
    'curly': 'error',
    'style/max-len': [
      'error',
      {
        code: 120,
      },
    ],
    'style/object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],
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
