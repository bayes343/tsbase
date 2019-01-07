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
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter',
      'karma-coverage'
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'karma-typescript', 'junit', 'coverage'],
    browsers: ['ChromeHeadless'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
      ]
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    }
  })
}

process.env.CHROME_BIN = require('puppeteer').executablePath()