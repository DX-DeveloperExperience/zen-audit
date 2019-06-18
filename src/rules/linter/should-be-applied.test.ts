import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack/index';
import { Linter } from './index';

const rootPath = 'linter/';
const packageJSONPath = `${rootPath}package.json`;
const tslintPath = `${rootPath}tslint.json`;
const eslintPath = `${rootPath}eslint.json`;

const fs = require('fs-extra');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return true if tslint or eslint not in devDependencies and tslint.json and eslint.json does not exist', () => {
  const packageJSON = {
    obj: {
      other: 'other',
      tslint: 'not_in_devdependencies',
    },
    devDependencies: {
      dependency1: 'dep1',
      dependency2: 'dep2',
    },
  };

  ListStacks.findAvailableStackIn = jest.fn(() => {
    return Promise.resolve({} as Stack);
  });

  fs.pathExists = jest.fn(() => {
    return Promise.resolve(false);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  const linter = new Linter(rootPath);

  return linter.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if tslint in devDependencies and tslint.json exists', () => {
  const packageJSON = {
    devDependencies: {
      tslint: 'tslint',
    },
  };

  ListStacks.findAvailableStackIn = jest.fn(() => {
    return Promise.resolve({} as Stack);
  });

  fs.pathExists = jest.fn(() => {
    return Promise.resolve(true);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  return new Linter(rootPath).shouldBeApplied().then(result => {
    expect(fs.pathExists).toBeCalledWith(tslintPath);
    expect(result).toBeFalsy();
  });
});

test('should return true if tslint in devDependencies and tslint.json does not exist', () => {
  const packageJSON = {
    devDependencies: {
      tslint: 'tslint',
    },
  };

  ListStacks.findAvailableStackIn = jest.fn(() => {
    return Promise.resolve({} as Stack);
  });

  fs.pathExists = jest.fn(() => {
    return Promise.resolve(false);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  return new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith(tslintPath);
  });
});

test('should return false if eslint in devDependencies and eslint.json exists', () => {
  const packageJSON = {
    devDependencies: {
      eslint: 'eslint',
    },
  };

  ListStacks.findAvailableStackIn = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  fs.pathExists = jest.fn(() => {
    return Promise.resolve(true);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  return new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
    expect(fs.pathExists).toBeCalledWith(eslintPath);
  });
});

test('should return true if eslint in devDependencies and eslint.json does not exist', () => {
  const packageJSON = {
    devDependencies: {
      eslint: 'eslint',
    },
  };

  ListStacks.findAvailableStackIn = jest.fn(() => {
    return Promise.resolve(undefined);
  });

  fs.pathExists = jest.fn(() => {
    return Promise.resolve(false);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  return new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith(eslintPath);
  });
});
