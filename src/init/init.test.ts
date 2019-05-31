import { importClassesIn } from '.';
import * as fs from 'fs';

const mockFS = require('mock-fs');

mockFS({
  root: {
    folder: {
      'file1.ts': 'test',
      'file2.ts': 'test',
      rules: {
        rule1: {
          'index.ts': 'export class Rule1{ static test = "test" }',
          'other.ts': '',
          'other.d.ts': '',
        },
        rule2: {
          'index.ts': 'export class Rule2{ static test = "test" }',
          'index.d.ts': '',
        },
        multipleRules: {
          rule11: {
            'index.ts': 'export class Rule11 { static test = "test" }',
          },
          rule12: {
            'index.ts': 'export class Rule12 { static test = "test" }',
          },
        },
      },
    },
  },
});

afterAll(() => {
  mockFS.restore();
});

test('should import rule1 in rules dir', () => {
  // console.log(fs.readdirSync('./root/folder'));
  //   jest.mock('root/folder/rules/rule1', () => {
  //     return jest.fn(() => {
  //       class Rule1 {
  //         static test = 'test';
  //       }
  //     });
  //   });
  //   importClassesIn('root/folder/rules');
  //   //   const rule1 = require('root/folder/rules/rule1/index.ts');
  //   //   const fstat = fs.lstatSync('root/folder/rules/multipleRules');
  //   //   expect(fstat.isDirectory()).toBeTruthy();
  //   //   expect(rule1.test).toEqual('test');
  //   expect(require).toBeCalledWith('root/folder/rule1');
});
