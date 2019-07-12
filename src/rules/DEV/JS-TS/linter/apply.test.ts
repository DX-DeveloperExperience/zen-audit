import { Linter } from './index';
import { ListStacks } from '../../../../stacks/list-stacks/index';
import Stack from '../../../../stacks/stack/index';
import Globals from '../../../../utils/globals/index';
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

  ListStacks.findAvailableStack = jest.fn(() => {
    return Promise.resolve({} as Stack);
  });

  jest.mock('linter/package.json', () => packageJSON, { virtual: true });

  const linterRule = new Linter();

  commands.installNpmDevDep = jest.fn(() => {
    return Promise.resolve();
  });

  return linterRule.apply(true);
});
