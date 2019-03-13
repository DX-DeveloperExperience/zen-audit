import TsLint from '../../rules/ts-lint';
import * as fs from 'fs';

const rootPath = './src/tests/rules/';
const packageFilePath = rootPath + 'package.json';

test('isInDevDep should return false if ts-lint not in dev dependencies', () => {
  const packageJSON = {
    devDependencies: {
      dependency1: 'dependency1',
      dependency2: 'dependency2',
    },
  };

  fs.writeFileSync(packageFilePath, JSON.stringify(packageJSON), {
    encoding: 'utf8',
  });

  expect(new TsLint(rootPath).isInDevDep()).toBeFalsy();

  fs.unlinkSync(packageFilePath);
});

test('isInDevDep should return true if ts-lint in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dependency1: 'dependency1',
      'ts-lint': 'dependency2',
    },
  };
});

test('isInDevDep should return false if ts-lint found elsewhere than in devDependencies', () => {
  const packageJSON = {
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
  };

  expect(new TsLint(rootPath).isInDevDep()).toBeFalsy();
});
