// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const HtmlReporter = require('protractor-beautiful-reporter');
const CHROME_BINARY = "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome";
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      args: ["--start-maximized", '--headless']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:8080/',
  framework: 'jasmine',
  plugins: [{
    path: 'node_modules/protractor-istanbul-plugin',
    logAssertions: true,
    outputPath: './coverage/e2e',

  }],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    }
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: 'coverage/e2e/report',
      screenshotsSubfolder: 'images',
      jsonsSubfolder: 'jsons',
      takeScreenShotsOnlyForFailedSpecs: false,
      docName: 'index.html',
      preserveDirectory: false,
      gatherBrowserLogs: true
    }).getJasmine2Reporter());

  }
};
