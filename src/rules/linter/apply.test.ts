import { Linter } from './index';
import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';
const rootPath = 'linter/';
const util = require('util');

const cp = require('child_process');
jest.mock('child_process');

const fs = require('fs-extra');
jest.mock('fs-extra');

require('../../logger');
jest.mock('../../logger');

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

  ListStacks.getStackByName = jest.fn(() => {
    return Promise.resolve({
      isAvailable() {
        return Promise.resolve(true);
      },
    } as Stack);
  });

  jest.mock('linter/package.json', () => packageJSON, { virtual: true });

  const linterRule = new Linter(rootPath);

  util.promisify = jest.fn((exec: (cmd: string, {}) => {}) => {
    return (cmd: string) => {
      exec(cmd, {});
      return Promise.resolve();
    };
  });

  return linterRule.apply(true).then(() => {
    expect(cp.exec).toBeCalled();
  });
});
