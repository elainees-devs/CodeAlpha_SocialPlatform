module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.ts"],

  clearMocks: true,
  testTimeout: 30000,

  modulePathIgnorePatterns: ["<rootDir>/dist/"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};