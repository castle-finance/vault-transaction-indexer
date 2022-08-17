module.exports = {
  roots: ["<rootDir>", "./src"],
  testMatch: ["**/*.test.ts", "**/__tests__/*.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  modulePathIgnorePatterns: ["^.+\\.d.ts?$"]
};
