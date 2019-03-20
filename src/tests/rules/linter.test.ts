import Linter from '../../rules/linter';

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

test('isInDevDep should return false if tslint found elsewhere than in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      dependency2: 'dependency2',
    },
    other: {
      'ts-lint': 'ts-lint',
    },
    'ts-lint': {
      other1: 'other',
      other2: 'other2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Linter(rootPath).isInDevDep()).toBeFalsy();
});
