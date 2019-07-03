import { Constructor } from './../../stacks/stack-register/index';
import { ListStacks } from './../../stacks/list-stacks/index';
import { FrontAppDebug } from '.';
import Globals from '../../utils/globals';
import VueJS from '../../stacks/vue-js';
import Stack from '../../stacks/stack';

Globals.rootPath = 'front-app-debug/';

const fs = require('fs-extra');
const launchFilePath = `${Globals.rootPath}.vscode/launch.json`;

jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
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
        request: 'launch',
        name: 'vuejs: firefox',
        url: 'http://localhost:8080',
        webRoot: '${workspaceFolder}/src',
        pathMappings: [{ url: 'webpack:///src/', path: '${webRoot}/' }],
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
