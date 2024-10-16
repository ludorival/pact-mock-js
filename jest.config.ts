import config from './jest.config.base'
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  ...config,

  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/vw/jpxh5xps19707qdgltpvw4w00000gn/T/jest_dx",

  moduleNameMapper: {
    'pact-mock-js.msw': '<rootDir>/src/index',
  },

  projects: ['<rootDir>/packages/*'],
}
