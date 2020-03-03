const ExcelJS = require('exceljs');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const path = require('path');

const getHeaderData = (worksheet) => {
  const headers = _.range(1, 5).map(col => worksheet.getColumn(col).values);
  const headerData = _.range(4, headers[0].length).map((row, index) => {
    const data = {
      type: headers[0][row],
      subtype: headers[1][row],
      jsonpath: headers[2][row],
      fieldType: headers[3][row],
      index: index + 4,
    };
    return data;
  });
  return headerData;
};

const getReqBody = (headerData, casedata) => {
  const reqBodySetting = headerData.filter(d => d.type === 'Input' && d.subtype === 'reqBody');
  const reqBody = {};
  reqBodySetting.forEach(s => _.set(reqBody, s.jsonpath, casedata[s.index]));
  return {
    reqBody
  };
};

const getMocks = (headerData, casedata) => {
  const mocksSetting = headerData.filter(d => d.type === 'mocks');
  const dataByGroup = _.groupBy(mocksSetting, 'subtype');
  const mocksData = Object.keys(dataByGroup).map(k => {
    const mockData = {};
    mockSetting = dataByGroup[k];
    mockSetting.forEach(s => {
      _.set(mockData, s.jsonpath,  casedata[s.index]);
    });
    return mockData;
  });
  return mocksData;
};

const getVerify = (headerData, casedata) => {
  const statusCodeSetting = headerData.find(d => d.type === 'verify' && d.subtype === 'statusCode');
  const verifyDataSetting = headerData.filter(d => d.type === 'verify' && d.subtype === 'verifyData');

  const verifyData = {};
  verifyDataSetting.forEach(s => _.set(verifyData, s.jsonpath, casedata[s.index]));
  
  return {
    statusCode: casedata[statusCodeSetting.index],
    verifyData,
  };

};

const xls2json = async (input,output) => {
  console.log(input, output);
  const execlFile = new ExcelJS.Workbook();
  await execlFile.xlsx.readFile(path.resolve(input));

  // const cases = [];
  const worksheet = execlFile.getWorksheet(1);
  const headerData = getHeaderData(worksheet);

  const columns = _.range(5, worksheet.columnCount + 1);
  
  const cases = columns.map((singleCol) => {
    const casedata = worksheet.getColumn(singleCol).values;

    const testcase = {
      description: casedata[2],
      condition: casedata[3],
    };
    return {
      testcase,
      input: getReqBody(headerData, casedata),
      mocks: getMocks(headerData, casedata),
      verify: getVerify(headerData, casedata),
    };
  });

  jsonfile.writeFileSync(path.resolve(output), cases, { spaces: 2, EOL: '\r\n' });

};

module.exports.xls2json = xls2json;
