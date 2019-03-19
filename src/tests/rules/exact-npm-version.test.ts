import { FileNotFoundError } from './../../errors/FileNotFoundError';
import ExactNpmVersion from '../../rules/exact-npm-version';
import * as fs from 'fs';

const rootPath = './src/tests/rules/';
const packageFilePath = rootPath + 'package.json';

jest.mock('fs');
jest.mock('axios');

test('Must throw FileNotFoundError if package.json not found', () => {
  function instanciate() {
    return new ExactNpmVersion(rootPath);
  }

  expect(instanciate).toThrowError(FileNotFoundError);
});

test('Should return false if no incorrect semver is found', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '1.3.4',
      dep4: '1.2.5',
    },
  });
  //fs.readFileSync.mockResolvedValue(packageJSON);

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

  expect(new ExactNpmVersion(rootPath).exists()).toBeFalsy();

  fs.unlinkSync(packageFilePath);
});

test('Should return true if incorrect semver with ^ is found', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '^1.3.4',
      dep4: '1.2.5',
    },
  });

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

  expect(new ExactNpmVersion(rootPath).exists()).toBeFalsy();

  fs.unlinkSync(packageFilePath);
});

test('Should return true if incorrect semver with ~ is found', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '~1.3.4',
      dep4: '1.2.5',
    },
  });

  fs.writeFileSync(packageFilePath, packageJSON, { encoding: 'utf8' });

  expect(new ExactNpmVersion(rootPath).exists()).toBeFalsy();

  fs.unlinkSync(packageFilePath);
});

test('Should replace ^ or ~ in package.json', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '^0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '~1.3.4',
      dep4: '1.2.5',
    },
  });
});
