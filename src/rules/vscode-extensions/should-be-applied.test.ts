import { VSCodeExtensions } from '.';

const fs = require('fs');
jest.mock('fs');

const cp = require('child_process');
jest.mock('child_process');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const rootPath = 'test/';
const extensionsJSONPath = rootPath + '.vscode/extensions.json';

test('should return true if .vscode/extensions.json and .vscode folder do not exist but vscode is installed', () => {
  cp.execSync.mockImplementation(() => {
    return 'code -v mocked result';
  });

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('Method shouldBeApplied() should return true if .vscode/extension.json does not exist but .vscode folder do', () => {
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

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/extensions.json is empty', () => {
  jest.mock(extensionsJSONPath, () => ({}), { virtual: true });

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/extensions.json has no recommendations array', () => {
  const extensionsJSON = {
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: {
      key1: 'value1',
    },
  };

  jest.mock(extensionsJSONPath, () => extensionsJSON, {
    virtual: true,
  });

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/extensions.json contains an empty "recommendations" array', () => {
  const extensionsJSON = {
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: [],
  };

  jest.mock(extensionsJSONPath, () => extensionsJSON, {
    virtual: true,
  });

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/extension.json does not contains all recommended extensions', () => {
  const extensionsJSON = {
    recommendations: ['ext1', 'ext2'],
  };

  jest.mock(extensionsJSONPath, () => extensionsJSON, {
    virtual: true,
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return Promise.resolve([
      { name: 'extension1', value: 'ext1' },
      { name: 'extension3', value: 'ext3' },
    ]);
  });

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if .vscode/extension.json contains all recommended extensions', () => {
  const extensionsJSON = {
    recommendations: ['ext1', 'ext2'],
  };

  jest.mock(extensionsJSONPath, () => extensionsJSON, {
    virtual: true,
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions(rootPath);

  vsCodeExtension.getChoices = jest.fn(() => {
    return Promise.resolve([
      { name: 'extension1', value: 'ext1' },
      { name: 'extension2', value: 'ext2' },
    ]);
  });

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
