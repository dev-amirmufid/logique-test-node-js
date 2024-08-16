module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  clearMocks: true,
};
