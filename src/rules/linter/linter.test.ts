import { FileNotReadableError } from './../../errors/FileNotReadableError';
import { Linter } from '../../rules/linter';

const fs = require('fs');
jest.mock('fs');

const rootPath = 'linter/';
const packageJSONPath = `${rootPath}package.json`;

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return true if tslint or eslint not in devDependencies', () => {
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
