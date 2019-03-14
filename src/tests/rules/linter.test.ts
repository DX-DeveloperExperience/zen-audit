import Linter from '../../rules/linter';
import * as fs from 'fs';

const rootPath = './src/tests/rules/';
const packageFilePath = rootPath + 'package.json';

afterEach(() => {
  fs.unlinkSync(packageFilePath);
});

test('isInDevDep should return false if tslint not in dev dependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      dependency2: 'dependency2',
    },
  });

  fs.writeFileSync(packageFilePath, packageJSON, {
    encoding: 'utf8',
  });

  expect(new Linter(rootPath).isInDevDep()).toBeFalsy();
});

test('isInDevDep should return true if tslint in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      tslint: 'dependency2',
    },
  });

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

  expect(new Linter(rootPath).isInDevDep()).toBeTruthy();
});

test('isInDevDep should return true if eslint is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dependency1: 'dependency1',
      eslint: 'dependency2',
    },
  });

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

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

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

  expect(new Linter(rootPath).isInDevDep()).toBeFalsy();
});
