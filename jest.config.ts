import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    detectOpenHandles: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/services/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    clearMocks: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // 👈 faz o @/ apontar para src/
    },
};

export default config;
