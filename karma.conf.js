// Karma configuration
// Generated on Sun Aug 18 2019 03:33:56 GMT-0400 (Eastern Daylight Time)
const webpackEnv = {test:true};
const path = require('path');
const webpackConfig = require('./webpack.config');
webpackConfig.mode = 'development';
webpackConfig.plugins=[];
webpackConfig.entry = {
  index: path.join(__dirname, 'src/index.js')
}

webpackConfig.output.filename = '[name].[hash:8].js';
const fileGlob = './src/tests/index.test.js';

process.env.BABEL_ENV = 'test';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

  //{ pattern: './src/tests/**/*.test.js', watched: true },

    // list of files / patterns to load in the browser
    files: [

      {pattern: './node_modules/ramda/dist/ramda.min.js', watched:false},
      { pattern: './node_modules/rxjs/*.js', included:false,   watched: false },
      { pattern: './node_modules/rxjs/**/*.js', included:false,    watched: false },

      { pattern: './src/tests/traits/dynamic-app-data*.test.js', watched: true },

    ],



    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/tests/**/*.test.js': ['webpack']
    },

    webpack: webpackConfig,
    webpackMiddleware: {noInfo:true},

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
