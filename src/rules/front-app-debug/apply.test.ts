import { ListStacks } from '../../stacks/list-stacks/index';
import { Constructor } from '../../stacks/stack-register/index';
import Stack from '../../../lib/stacks/stack/index';
import VueJS from '../../stacks/vue-js/index';
import { FrontAppDebug } from './index';
import Globals from '../../utils/globals';

Globals.rootPath = 'front-app-debug/';

const fs = require('fs-extra');
const launchFilePath = `${Globals.rootPath}.vscode/launch.json`;

jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should add missing configurations', () => {
  const mockLaunchFile = {
    version: '0.2.0',

    configurations: [
      {
        type: 'firefox',
      },
    ],
  };

  const resultLaunchFile = {
    version: '0.2.0',
    configurations: [
      {
        type: 'firefox',
      },
      {
        type: 'chrome',
      },
    ],
  };

  ListStacks.stackIsAvailable = jest.fn(
    async (stackCtor: Constructor<Stack>) => {
      if (stackCtor === VueJS) {
        return true;
      }
      return false;
    },
  );

  jest.mock(launchFilePath, () => mockLaunchFile, { virtual: true });

  fs.writeJSON = jest.fn();

  const frontAppDebug = new FrontAppDebug();

  return frontAppDebug.apply(true).then(() => {
    expect(fs.writeJSON).toBeCalledWith(launchFilePath, resultLaunchFile, {
      spaces: '\t',
    });
  });
});
