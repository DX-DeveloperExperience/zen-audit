import { Linter } from './index';
const rootPath = 'linter/';

const cp = require('child_process');
jest.mock('child_process');

const util = require('util');
jest.mock('util');

const fs = require('fs-extra');
jest.mock('fs-extra');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

fs.ensureFile.mockImplementation(() => {
  return Promise.resolve();
});

fs.writeJson.mockImplementation((path: string, content: any) => {
  return Promise.resolve();
});

test('should install tslint as devDependencies and create tslint.json', done => {
  const packageJSON = {
    devDependencies: {
      typescript: 'test',
    },
  };

  jest.mock('linter/package.json', () => packageJSON, { virtual: true });

  const linterRule = new Linter(rootPath);

  util.promisify.mockImplementation((exec: (cmd: string) => void) => {
    return (cmd: string) => {
      expect(cmd).toBe('npm i tslint typescript -DE');
      done();
      return Promise.resolve();
    };
  });

  return linterRule.apply(true);
});
