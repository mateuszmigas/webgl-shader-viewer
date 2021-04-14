module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      "^@common/(.*)$": "<rootDir>/src/common/$1",
      "^@utils/(.*)$": "<rootDir>/src/utils/$1",
      "^@extensionState$": "<rootDir>/src/extensionState",
      "^@extensionStore$": "<rootDir>/src/extensionStore",
      "^@meshes/(.*)$": "<rootDir>/src/viewer/meshes/$1",
      "^@meshes$": "<rootDir>/src/viewer/meshes",
    }
  };