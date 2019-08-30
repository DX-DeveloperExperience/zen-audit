import { Prettier } from '.';
import Globals from '../../../../utils/globals/index';
const commands = require('../../../../utils/commands');

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

  commands.execInRootpath = jest.fn((cmd: string) => {
    expect(cmd).toBe('npm i prettier -DE');
    return Promise.resolve({ stdout: '', stderr: '' });
  });

  return prettier.apply();
});
