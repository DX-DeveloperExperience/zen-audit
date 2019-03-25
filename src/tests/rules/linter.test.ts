import { Linter } from '../../rules/linter';
import FileUtils from '../../file-utils';

const fs = require('fs');
jest.mock('fs');

const rootPath = './src/tests/rules/';

test('isInDevDep should return false if tslint not in dev dependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      dependency2: 'dependency2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Linter(rootPath).isInDevDep()).toBeFalsy();
});

test('isInDevDep should return true if tslint in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      tslint: 'dependency2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Linter(rootPath).isInDevDep()).toBeTruthy();
});

test('isInDevDep should return true if eslint is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      eslint: 'dependency2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Linter(rootPath).isInDevDep()).toBeTruthy();
});

test('isInDevDep should return false if tslint or eslint found elsewhere than in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      dependency2: 'dependency2',
    },
    other: {
      tslint: 'tslint',
    },
    tslint: {
      other1: 'other',
      other2: 'other2',
    },
    eslint: {
      other3: 'eslint',
      other4: 'other',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Linter(rootPath).isInDevDep()).toBeFalsy();
});

test('shouldBeApplied should return true if tslint.json does not exist and tslint not in devDependencies', () => {
  const linter = new Linter(rootPath);

  linter.isInDevDep = jest
    .fn()
    .mockName('isInDevDepMock')
    .mockReturnValue(false);

  FileUtils.filesExistIn = jest.fn().mockReturnValue(false);

  expect(linter.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return true if tslint.json does not exist but tslint is in devDependencies', () => {
  const linter = new Linter(rootPath);

  linter.isInDevDep = jest
    .fn()
    .mockName('isInDevDepMock')
    .mockReturnValue(true);

  FileUtils.filesExistIn = jest.fn().mockReturnValue(false);

  expect(linter.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return true if tslint.json exists but tslint is not in devDependencies', () => {
  const linter = new Linter(rootPath);

  linter.isInDevDep = jest.fn().mockReturnValue(false);

  FileUtils.filesExistIn = jest.fn().mockReturnValue(true);

  expect(linter.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return false if tslint.json exists and tslint is in devDependencies', () => {
  const linter = new Linter(rootPath);

  linter.isInDevDep = jest.fn().mockReturnValue(true);

  FileUtils.filesExistIn = jest.fn().mockReturnValue(true);

  expect(linter.shouldBeApplied()).toBeFalsy();
});
