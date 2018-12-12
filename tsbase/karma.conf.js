module.exports = function (config) {
  config.set({
    frameworks: [
      'jasmine',
      'karma-typescript'
    ],
    files: [
      { pattern: 'src/**/*.ts' }
    ],
    plugins: [
      'karma-typescript',
      'karma-jasmine',
      'karma-chrome-launcher'
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['ChromeHeadless']
  })
}

process.env.CHROME_BIN = require('puppeteer').executablePath()