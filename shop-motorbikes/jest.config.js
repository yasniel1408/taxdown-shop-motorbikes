/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/infrastructure/config/',
    '/src/handler.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/infrastructure/config/',
    '/src/handler.ts'
  ],
  setupFiles: ['reflect-metadata']
};
