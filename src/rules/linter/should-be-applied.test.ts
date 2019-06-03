import { Linter } from '.';

const rootPath = 'linter/';
const packageJSONPath = `${rootPath}package.json`;

const fs = require('fs-extra');
jest.mock('fs-extra');

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

  fs.pathExists.mockImplementation(() => {
    return Promise.resolve(false);
  });

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if tslint in devDependencies and tslint.json exists', () => {
  const packageJSON = {
    devDependencies: {
      tslint: 'tslint',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if tslint in devDependencies and tslint.json does not exist', () => {
  const packageJSON = {
    devDependencies: {
      tslint: 'tslint',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if eslint in devDependencies and eslint.json exists', () => {
  const packageJSON = {
    devDependencies: {
      eslint: 'eslint',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if eslint in devDependencies and eslint.json does not exist', () => {
  const packageJSON = {
    devDependencies: {
      eslint: 'eslint',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});
