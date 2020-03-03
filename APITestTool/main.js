const testplans = require('./testplan.json');
const { xls2json } = require('./createjson');
const newman = require('newman');
const path = require('path');

(async () => {
  for(let i = 0; i < testplans.length ; i += 1) {
    const crtTest = testplans[i];
    await xls2json(crtTest.testDataXls, crtTest.testDataJSON);
    await newman.run({
      collection: require(crtTest.testcase),
      reporters: 'htmlextra',
      environment: crtTest.env,
      iterationData: crtTest.testDataJSON,
      reporter: {
        htmlextra : {
          export : path.resolve(crtTest.report),
          template: crtTest.reporttemplate
        },
      }
    });
    console.log('ok');
  }
  // testplans.forEach((testplan) => {
  // xls2json(testplan.testDataXls, testplan.testDataJSON)
  //   .then(() => {
  //     newman.run({
  //       collection: require(testplan.testcase),
  //       reporters: 'htmlextra',
  //       environment: testplan.env,
  //       iterationData: testplan.testDataJSON,
  //       reporter: {
  //         htmlextra : {
  //           export : path.resolve(testplan.report),
  //           template: testplan.reporttemplate
  //         },
  //       }
  //     },  (err) => {
  //       if (err) { throw err; }
  //       console.log('collection run complete!');
  //     });
  //   })
  //   .catch((e) => console.error(e));
  // });
})();

