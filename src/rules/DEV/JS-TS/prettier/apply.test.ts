import { Prettier } from '.';
import Globals from '../../../../utils/globals/index';

Globals.rootPath = './prettier/';

const util = require('util');

const cp = require('child_process');
jest.mock('child_process');

require('../../../../logger');
jest.mock('../../../../logger');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('Should run npm i prettier -DE command', () => {
  jest.mock(Globals.rootPath + 'package.json', () => ({}), { virtual: true });

  const prettier = new Prettier();

  util.promisify = jest.fn((exec: (cmd: string) => {}) => {
    return (cmd: string) => {
      expect(cmd).toBe('npm i prettier -DE');
      return Promise.resolve();
    };
  });

  return prettier.apply(true);
});
