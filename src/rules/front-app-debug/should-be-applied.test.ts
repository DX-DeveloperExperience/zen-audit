import { Constructor } from './../../stacks/stack-register/index';
import { ListStacks } from './../../stacks/list-stacks/index';
import { FrontAppDebug } from '.';
import Globals from '../../utils/globals';
import Stack from '../../stacks/stack';
import { configs } from './__mocks__/constants';
import VueJS from '../../stacks/vue-js/index';

Globals.rootPath = 'front-app-debug/';

const fs = require('fs-extra');
const launchFilePath = `${Globals.rootPath}.vscode/launch.json`;

beforeEach(() => {
  jest.mock('./constants');
});

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

ListStacks.stackIsAvailable = jest.fn(async (stackCtor: Constructor<Stack>) => {
  if (stackCtor === VueJS) {
    return true;
  }
  return false;
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

  ListStacks.stackIsAvailable = jest.fn(
    async (stackCtor: Constructor<Stack>) => {
      if (stackCtor === VueJS) {
        return true;
      }
      return false;
    },
  );

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

  ListStacks.stackIsAvailable = jest.fn(
    async (stackCtor: Constructor<Stack>) => {
      if (stackCtor === VueJS) {
        return true;
      }

      return false;
    },
  );

  jest.mock(launchFilePath, () => mockLaunchFile, { virtual: true });

  const frontAppDebug = new FrontAppDebug();

  return frontAppDebug.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
