import { VSCodeExtensions } from '.';
import Globals from '../../utils/globals/index';
import { ListStacks } from '../../stacks/list-stacks/index';

const fs = require('fs-extra');
jest.mock('fs-extra');

const cp = require('child_process');
jest.mock('child_process');

jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

beforeEach(() => {
  ListStacks.getAvailableStacksIn = jest.fn(() => {
    return Promise.resolve([
      {
        name() {
          return 'stack1';
        },
      },
      {
        name() {
          return 'stack2';
        },
      },
    ] as any[]);
  });
});

Globals.rootPath = 'should-be-applied/';
const extensionsJSONPath = Globals.rootPath + '.vscode/extensions.json';

test('should return true if .vscode/extensions.json and .vscode folder do not exist but vscode is installed', () => {
  cp.execSync.mockImplementation(() => {
    return 'code -v mocked result';
  });

  fs.lstatSync = jest.fn(() => {
    return {
      isDirectory() {
        return false;
      },
    };
  });

  jest.mock(
    extensionsJSONPath,
    () => {
      throw new Error();
    },
    { virtual: true },
  );

  return new VSCodeExtensions().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if .vscode/extension.json does not exist but .vscode folder do and vscode not installed', () => {
  fs.lstatSync = jest.fn(() => {
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

test('should return true if .vscode/extensions.json recommendations is not an array', () => {
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

  const vsCodeExtension = new VSCodeExtensions();

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if .vscode/extension.json contains all recommended extensions', () => {
  const extensionsJSON = {
    recommendations: ['ext1', 'ext2', 'ext3'],
  };

  jest.mock(extensionsJSONPath, () => extensionsJSON, {
    virtual: true,
  });

  cp.execSync.mockImplementation((param: string) => {
    if (param === 'code -v') {
      return 'code -v mocked result';
    }
  });

  const vsCodeExtension = new VSCodeExtensions();

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return false if .vscode/extensions.json does not exist, nor .vscode folder, and vscode is not installed', () => {
  jest.mock(
    extensionsJSONPath,
    () => {
      throw new Error();
    },
    { virtual: true },
  );

  fs.lstatSync = jest.fn(() => {
    return {
      isDirectory() {
        return false;
      },
    };
  });

  cp.execSync.mockImplementation(() => {
    throw new Error();
  });

  const vsCodeExtension = new VSCodeExtensions();

  return vsCodeExtension.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
