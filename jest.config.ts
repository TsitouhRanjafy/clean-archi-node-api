import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testMatch: [
    "**/*.spec.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ]
};

export default config;