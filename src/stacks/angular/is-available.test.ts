import Globals from '../../utils/globals';
import Angular from '.';
import { ReadFileError } from '../../errors/file-errors';

Globals.rootPath = 'test/angular/';

beforeEach(() => {
  jest.resetModules();
});

test('should return false if @angular/core is not in dependencies', () => {
  const packageJSON = {
    dependencies: {
      'not-angular': 'version',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  return new Angular().isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return false if module is not available', () => {
  const err: NodeJS.ErrnoException = new Error();
  err.code = 'MODULE_NOT_FOUND';

  jest.mock(
    Globals.packageJSONPath,
    () => {
      throw err;
    },
    { virtual: true },
  );

  return new Angular().isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if @angular/core is in dependencies', () => {
  const packageJSON = {
    dependencies: {
      '@angular/core': 'version',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  return new Angular().isAvailable().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should throw an ReadFileError exception if require throw an exception with another code than MODULE_NOT_FOUND', () => {
  const err: NodeJS.ErrnoException = new Error();
  err.code = 'NOT_MODULE_NOT_FOUND';

  function newAngular() {
    return new Angular();
  }

  jest.mock(
    Globals.packageJSONPath,
    () => {
      throw err;
    },
    { virtual: true },
  );

  expect(newAngular).toThrow(
    new ReadFileError(err, Globals.packageJSONPath, 'Angular'),
  );
});
