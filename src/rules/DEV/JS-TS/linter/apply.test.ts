import { Linter } from './index';
import Stack from '../../../../stacks/stack/index';
import Globals from '../../../../utils/globals/index';
import { Register } from '../../../../register';
const commands = require('../../../../utils/commands/index');

const fs = require('fs-extra');
jest.mock('fs-extra');

require('../../../../logger');
jest.mock('../../../../logger');

Globals.rootPath = 'linter/';

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

test('should install tslint as devDependencies and create tslint.json', () => {
  const packageJSON = {
    devDependencies: {
      typescript: 'test',
    },
  };

  Register.stackIsAvailable = jest.fn(() => {
    return Promise.resolve(true);
  });

  jest.mock('linter/package.json', () => packageJSON, { virtual: true });

  const linterRule = new Linter();

  commands.installNpmDevDep = jest.fn(() => {
    return Promise.resolve();
  });

  return linterRule.apply(true);
});
