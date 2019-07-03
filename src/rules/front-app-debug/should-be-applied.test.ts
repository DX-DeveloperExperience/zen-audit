import { FrontAppDebug } from '.';
import Globals from '../../utils/globals';

Globals.rootPath = 'front-app-debug/';

const fs = require('fs-extra');
const launchFilePath = `${Globals.rootPath}.vscode/launch.json`;

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
  //   const mockLaunchFile = {
  //     configurations: [
  //       {
  //         type: 'notChrome',
  //       },
  //     ],
  //   };
  //   jest.mock(launchFilePath, () => mockLaunchFile, { virtual: true });
  //   const frontAppDebug = new FrontAppDebug();
  //   return frontAppDebug.shouldBeApplied().then(result => {
  //     expect(result).toBeTruthy();
  //   });
});
