import { VSCodeExtensions } from '../../rules/vscode-extensions';

const fs = require('fs');
jest.mock('fs');

const cp = require('child_process');
jest.mock('child_process');

afterEach(() => {
  jest.resetAllMocks();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json and .vscode folder do not exist but vscode is installed', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  fs.lstatSync.mockImplementation(() => {
    return {
      isDirectory() {
        return false;
      },
    };
  });

  cp.execSync.mockImplementation(() => {
    return '';
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extension.json does not exist but .vscode folder do', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  fs.lstatSync.mockImplementation(() => {
    return {
      isDirectory() {
        return true;
      },
    };
  });

  cp.execSync.mockImplementation(() => {
    throw new Error();
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json is empty', () => {
  fs.readFileSync.mockReturnValue('{}');

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json has no recommendations array', () => {
  const extensionsJSON = JSON.stringify({
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: {
      key1: 'value1',
    },
  });

  fs.readFileSync.mockReturnValue(extensionsJSON);

  const vscext = new VSCodeExtensions();
  expect(vscext.shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json contains an empty "recommendations" array', () => {
  const extensionsJSON = JSON.stringify({
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: [],
  });

  fs.readFileSync.mockReturnValue(extensionsJSON);

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});
