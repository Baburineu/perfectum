
WEB UI tests with Mocha, WebdriverIO v8 with PageObject

## Features
- WebdriverIO v8
- Page Object model
- Allure Report
- Video record for all tests

## How to Start

**Download or clone the project**

**Install**

```npm install```

**Run Tests**

```npm test```

**Execute single spec**

`npx wdio run ./wdio.conf.ts --spec <relativePath>`

**Allure Report**
(you must have installed [allure command line](https://www.npmjs.com/package/allure-commandline))

```npm run report```

### Clean up your test results before execution

`npm run clean.results`

### Debug Command Line Flag to adjust timeout

By setting the 'DEBUG' environment variable to true, the test timeout with be essentially removed, 
allowing you to run without your tests timing out. 

`DEBUG=true npm test`

 
### Structure: 
* `pageobjects` folder contains files with selectors and actions for these selectors.
* `specs` folder contains files with test scenarios.
* `_results_` folder contains test results (screenshots, videos) which will be used for generating report.
* `_results_/allure-raw` folder contains test results which will be used for generating report.
* `allure-report` folder contains generated report.
* `node_modules` folder contains all required libraries that were installed using `package.json`.
* `package.json` file contains all required libraries for success execute of test scenarios.
* `wdio.conf.ts` file contains all configurations for WebdriverIO testrunner.