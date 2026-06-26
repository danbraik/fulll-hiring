module.exports = {
  default: {
    paths: ['e2e/features/*/*.feature'],
    require: ['e2e/step_definitions/*.js'],
    requireModule: ['@babel/register'],
    publishQuiet: true,
    format: [
      '@cucumber/pretty-formatter',
      'json:e2e/reports/cucumber-report.json',
      'html:e2e/reports/cucumber-report.html',
      'summary:cucumber-report.txt',
    ],
  },
}
