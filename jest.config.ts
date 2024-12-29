import type { JestConfigWithTsJest } from 'ts-jest'

export default <JestConfigWithTsJest> {
  maxWorkers: 4,
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/view/**/*.test.t(s|sx)',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
}
