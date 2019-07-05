import Node from '../../stacks/node/index';
import { Husky } from './index';
import Globals from '../../utils/globals/index';
import { logger } from '../../logger';
const commands = require('../../utils/commands/index');

Globals.rootPath = 'husky/';

const fs = require('fs-extra');
jest.mock('fs-extra');

logger.info = jest.fn();

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('Method apply() should add husky to devDependencies and pre-push hook', () => {
  jest.mock(`${Globals.rootPath}package.json`, () => ({}), { virtual: true });

  const husky = new Husky();
  const node = new Node();

  const finalPackage = {
    husky: {
      hooks: {
        'pre-push': 'exit 1',
      },
    },
  };

  node.isAvailable = jest.fn(() => {
    return Promise.resolve(true);
  });

  fs.readJSON = jest.fn(() => {
    return Promise.resolve({});
  });

  fs.writeJSON = jest.fn(() => {
    return Promise.resolve();
  });

  commands.installNpmDevDep = jest.fn(() => {
    return Promise.resolve();
  });

  return husky.apply(true).then(() => {
    expect(commands.installNpmDevDep).toBeCalledWith('husky');
    expect(fs.writeJSON).toBeCalledWith(Globals.packageJSONPath, finalPackage, {
      spaces: '\t',
    });
    expect(logger.info).toBeCalledWith(
      `Husky Rule: Succesfully written pre-push hook to ${
        Globals.packageJSONPath
      }. You may update this hook with a npm script for it to launch before pushing to git.`,
    );
  });
});
