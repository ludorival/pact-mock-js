/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import type { Config } from 'jest'
const config: Config = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  transform: {
    '\\.(ts)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 80,
      statements: -10,
    },
  },
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  testEnvironment: 'node',
  reporters: [['github-actions', { silent: false }], 'default'],
}
export default config
