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
