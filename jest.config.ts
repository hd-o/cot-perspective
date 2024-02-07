import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  maxWorkers: 4,
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '**/spec/**/*.test.t(s|sx)',
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

export default config
