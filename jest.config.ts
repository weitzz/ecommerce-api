import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    detectOpenHandles: true,
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    clearMocks: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // 👈 faz o @/ apontar para src/
    },
};

export default config;
