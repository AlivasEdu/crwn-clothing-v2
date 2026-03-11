const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset({
  tsconfig: { jsx: "react-jsx" },
}).transform;

module.exports = {
  testEnvironment: "jsdom",
  transform: { ...tsJestTransformCfg },
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  transformIgnorePatterns: [
    "/node_modules/(?!(react-router-dom|react-router)/)",
  ],
  moduleNameMapper: {
    "^typed-redux-saga/macro$": "typed-redux-saga",
    "\\.svg$": "<rootDir>/src/__mocks__/svgrMock.tsx",
  },
};