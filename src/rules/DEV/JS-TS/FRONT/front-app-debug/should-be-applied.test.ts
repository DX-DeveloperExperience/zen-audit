import Constructor from '../../../../../constructor';
import { FrontAppDebug } from '../front-app-debug';
import Globals from '../../../../../utils/globals';
import Stack from '../../../../../stacks/stack';
import { configs } from './__mocks__/constants';
import VueJS from '../../../../../stacks/vue-js/index';
import { Register } from '../../../../../register';

Globals.rootPath = 'front-app-debug/';

const fs = require('fs-extra');
const launchFilePath = `${Globals.rootPath}.vscode/launch.json`;

jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

Register.stackIsAvailable = jest.fn(async (stackCtor: Constructor<Stack>) => {
  return stackCtor === VueJS;
});

test('should return true if .vscode/launch.json does not exist', () => {
  jest.mock(
    launchFilePath,
    () => {
      throw new Error();
    },
    { virtual: true },
  );

  const frontAppDebug = new FrontAppDebug();

  return frontAppDebug.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/launch.json misses configurations', () => {
  const mockLaunchFile = {
    configurations: [
      {
        type: 'firefox',
      },
    ],
  };

  Register.stackIsAvailable = jest.fn(async (stackCtor: Constructor<Stack>) => {
    return stackCtor === VueJS;
  });

  jest.mock(launchFilePath, () => mockLaunchFile, { virtual: true });

  const frontAppDebug = new FrontAppDebug();

  return frontAppDebug.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if .vscode/launch.json has all configurations', () => {
  const mockLaunchFile = {
    configurations: configs.vuejs.confs,
  };

  Register.stackIsAvailable = jest.fn(async (stackCtor: Constructor<Stack>) => {
    return stackCtor === VueJS;
  });

  jest.mock(launchFilePath, () => mockLaunchFile, { virtual: true });

  const frontAppDebug = new FrontAppDebug();

  return frontAppDebug.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
