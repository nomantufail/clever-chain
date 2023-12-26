const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/__test__/utils/setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/cassandra_data/',
    '<rootDir>/coverage/',
    '<rootDir>/upload/',
    '<rootDir>/uploads/',
    '<rootDir>/migrate.json'
  ],
};
