module.exports = {
  testRegex: './*\\.test\\.js$',
  testTimeout: 180000,
  globalSetup: './src/config/jest/globalSetup.js',
  globalTeardown: './src/config/jest/globalTeardown.js',
  testEnvironment: './src/config/jest/customEnv.js',
  setupFilesAfterEnv: ['./src/config/jest/setupAfterEnv.js'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
          keepClassNames: true,
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
            react: {
              runtime: 'automatic',
            },
          },
        },
        module: {
          type: 'es6',
          noInterop: false,
        },
      },
    ],
  },
};
