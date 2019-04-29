import { FileNotReadableError } from './../../errors/FileNotReadableError';
import { Husky } from '../../rules/husky';

const fs = require('fs');
jest.mock('fs');

test('Constructor should throw FileNotReadableException if file cannot be read', () => {
  function instantiate() {
    return new Husky();
  }

  fs.readFileSync.mockImplementation(() => {
    throw { code: 'NOT_ENOENT' };
  });

  expect(instantiate).toThrowError(FileNotReadableError);
});

test('shouldBeApplied() should return false if package.json does not exist', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  expect(new Husky().shouldBeApplied()).toBeFalsy();
});

test('shouldBeApplied() should return true if package.json does not contain devDependencies', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
    dummy: {
      dep1: 'dep1',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied() should return true if husky is not in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return false if husky is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      husky: 'dev1',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().shouldBeApplied()).toBeFalsy();
});

test('shouldBeApplied should return true if husky is something else than a dependency in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'husky',
      dep2: 'dep2',
    },
    other: {
      husky: 'husky',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().shouldBeApplied()).toBeTruthy();
});
