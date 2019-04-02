import { FileNotReadableError } from './../../errors/FileNotReadableError';
import { Prettier } from '../../rules/prettier';

const fs = require('fs');
jest.mock('fs');

test('Constructor should throw FileNotReadableError if file cannot be read', () => {
  function instantiate() {
    return new Prettier();
  }

  fs.readFileSync.mockImplementation(() => {
    throw { code: 'NOT_ENOENT' };
  });

  expect(instantiate).toThrowError(FileNotReadableError);
});

test('shouldBeApplied() should return false if package.json file does not exist', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  expect(new Prettier().shouldBeApplied()).toBeFalsy();
});

test('Should return false if prettier is not in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeFalsy();
});

test('Should return true if prettier is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      prettier: 'dev1',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeTruthy();
});

test('Should return false if prettier is something else than a dependency in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'prettier',
      dep2: 'dep2',
    },
    other: {
      prettier: 'prettier',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeFalsy();
});
