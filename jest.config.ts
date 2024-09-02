import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  roots: ['<rootDir>', '<rootDir>/src', '<rootDir>/src/shared'],
  modulePaths: ['<rootDir>', '<rootDir>/src'],
  moduleDirectories: [
    ...defaults.moduleDirectories,
    'node_modules',
    '<rootDir>/src/modules',
    '<rootDir>/src/shared',
  ],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
