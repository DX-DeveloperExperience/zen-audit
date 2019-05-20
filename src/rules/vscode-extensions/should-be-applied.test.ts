import { VSCodeExtensions } from '.';

const fs = require('fs');
jest.mock('fs');

const cp = require('child_process');
jest.mock('child_process');

afterEach(() => {
  jest.resetAllMocks();
});

const rootPath = './test/';

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
    return 'code -v mocked result';
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

test('Method shouldBeApplied() should return true if .vscode/extension.json does not contains all recommended extensions', () => {
  const extensionsJSON = JSON.stringify({
    recommendations: ['ext1', 'ext2'],
  });

  fs.readFileSync.mockImplementation((param: string) => {
    if (param === `${rootPath}.vscode/extensions.json`) {
      return extensionsJSON;
    }
  });

  fs.lstatSync.mockImplementation((param: string) => {
    if (param === `${rootPath}.vscode`) {
      return {
        isDirectory() {
          return true;
        },
      };
    }
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return [
      { name: 'extension1', value: 'ext1' },
      { name: 'extension2', value: 'ext2' },
      { name: 'extension3', value: 'ext3' },
    ];
  });

  expect(new VSCodeExtensions(rootPath).shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return false if .vscode/extension.json contains all recommended extensions', () => {
  const extensionsJSON = JSON.stringify({
    recommendations: ['ext1', 'ext2'],
  });

  fs.readFileSync.mockImplementation((param: string) => {
    if (param === `${rootPath}.vscode/extensions.json`) {
      return extensionsJSON;
    } else if (param === `${__dirname}/choices.json`) {
      return '{}';
    }
  });

  fs.lstatSync.mockImplementation((param: string) => {
    if (param === `${rootPath}.vscode`) {
      return {
        isDirectory() {
          return true;
        },
      };
    }
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return [
      { name: 'extension1', value: 'ext1' },
      { name: 'extension2', value: 'ext2' },
    ];
  });

  expect(vsCodeExtension.shouldBeApplied()).toBeFalsy();
});
