import { FileNotFoundError } from './../../errors/FileNotFoundError';
import ExactNpmVersion from '../../rules/exact-npm-version';

const fs = require('fs');

jest.mock('fs');

const rootPath = './src/tests/rules/';

test('Must throw FileNotFoundError if package.json not found', () => {
  function instanciate() {
    return new ExactNpmVersion(rootPath);
  }

  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

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
  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).shouldBeApplied()).toBeFalsy();
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

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).shouldBeApplied()).toBeFalsy();
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

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).shouldBeApplied()).toBeFalsy();
});

test('Should return false if incorrect semver is in json object that does not need to be checked', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '1.3.4',
      dep4: '1.2.5',
    },
    dummyObject: {
      dep5: '^1.3.4',
      dep6: '~1.3.4',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).shouldBeApplied()).toBeFalsy();
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

  const correctedJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '1.3.4',
      dep4: '1.2.5',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).correctSemverNotation()).toEqual(
    correctedJSON,
  );
});

test('Should not replace ^ or ~ in package.json for object that does not need to be corrected', () => {
  const packageJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '~0.5.4',
    },
    devDependencies: {
      dep3: '^1.3.4',
      dep4: '1.2.5',
    },
    dummyObject: {
      dep5: '^1.3.4',
      dep6: '~1.3.4',
    },
  });

  const correctedJSON = JSON.stringify({
    dependencies: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    devDependencies: {
      dep3: '1.3.4',
      dep4: '1.2.5',
    },
    dummyObject: {
      dep5: '^1.3.4',
      dep6: '~1.3.4',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion(rootPath).correctSemverNotation()).toEqual(
    correctedJSON,
  );
});
