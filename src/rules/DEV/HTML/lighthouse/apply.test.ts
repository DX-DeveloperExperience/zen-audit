import { LightHouse } from './index';
import Globals from '../../../../utils/globals';
require('../../../../logger');
const commands = require('../../../../utils/commands');
const fs = require('fs-extra');

Globals.rootPath = 'tests/lighthouse/';

jest.mock('../../../../logger');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should install lighthouse as a devDependency and add js script file and script to package.json', () => {
  const packageJSON = {
    devDependencies: {
      'not-lighthouse': 'version',
      other: 'version',
    },
  };

  const finalPackageJSON = {
    devDependencies: {
      'not-lighthouse': 'version',
      other: 'version',
    },
    scripts: {
      lighthouse: 'node lighthouse-scripts/lighthouse.js',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  commands.installNpmDevDep = jest.fn(() => {
    return Promise.resolve();
  });

  fs.ensureDir = jest.fn(() => {
    return Promise.resolve();
  });

  fs.copyFile = jest.fn(() => {
    return Promise.resolve();
  });

  fs.readJSON = jest.fn(() => {
    return Promise.resolve(packageJSON);
  });

  fs.writeJSON = jest.fn(() => {
    return Promise.resolve();
  });

  return new LightHouse().apply(true).then(() => {
    expect(commands.installNpmDevDep).toBeCalledWith('lighthouse');
    expect(fs.ensureDir).toBeCalledWith(
      Globals.rootPath + 'lighthouse-scripts/',
    );
    expect(fs.copyFile).toBeCalledWith(
      __dirname + '/script.js',
      Globals.rootPath + 'lighthouse-scripts/lighthouse.js',
    );
    expect(fs.readJSON).toBeCalledWith(Globals.packageJSONPath);
    expect(fs.writeJSON).toBeCalledWith(
      Globals.packageJSONPath,
      finalPackageJSON,
      { spaces: '\t' },
    );
  });
});
