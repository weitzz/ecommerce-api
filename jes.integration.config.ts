/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".",
    testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    globalSetup: "<rootDir>/tests/integration/globalSetup.ts",
    globalTeardown: "<rootDir>/tests/integration/globalTeardown.ts"
};
