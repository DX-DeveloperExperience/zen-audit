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

test('Constructor should throw FileNotReadableError if package.json file not readable', () => {
  jest.mock(
    packageJSONPath,
    () => {
      throw { code: 'NOT_MODULE_NOT_FOUND' };
    },
    { virtual: true },
  );

  function instantiate() {
    return new Linter(rootPath);
  }

  expect(instantiate).toThrowError(FileNotReadableError);
});

test('should return true if package.json does not exist', () => {
  jest.mock(packageJSONPath, () => {
    throw { code: 'MODULE_NOT_FOUND' };
  });
  new Linter(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if package.json exists but tslint or eslint not in devDependencies', () => {
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

test('should return false if package.json exists with tslint in devDependencies and tslint.json exists', () => {
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

test('should return true if package.json exists with tslint in devDependencies and tslint.json does not exist', () => {
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

test('should return false if package.json exists with eslint in devDependencies and eslint.json exists', () => {
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

test('should return true if package.json exists with eslint in devDependencies and eslint.json does not exist', () => {
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
