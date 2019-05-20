import { ExactNpmVersion } from '.';
import { FileNotReadableError } from '../../errors/FileNotReadableError';

const fs = require('fs');

jest.mock('fs');
jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
});

test('Constructor should throw FileNotReadable if package.json is not readable', () => {
  function instantiate() {
    return new ExactNpmVersion();
  }

  fs.readFileSync.mockImplementation(() => {
    throw { code: 'NOT_ENOENT' };
  });

  expect(instantiate).toThrowError(FileNotReadableError);
});

test('shouldBeApplied() should return false if package.json not found', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  expect(new ExactNpmVersion().shouldBeApplied()).toBeFalsy();
});

test('Should return false if no incorrect semver is found', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.2.3',
        dep2: '0.3.0',
      },
      mockDep2: {
        dep3: '1.3.4',
        dep4: '1.2.5',
      },
    },
    null,
    '\t',
  );
  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion().shouldBeApplied()).toBeFalsy();
});

test('Should return true if incorrect semver with ^ is found', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '^1.3.4',
        dep4: '1.2.5',
      },
    },
    null,
    '\t',
  );

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion().shouldBeApplied()).toBeTruthy();
});

test('Should return true if incorrect semver with ~ is found', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '~1.3.4',
        dep4: '1.2.5',
      },
    },
    null,
    '\t',
  );

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion().shouldBeApplied()).toBeTruthy();
});

test('Should return false if incorrect semver is in json object that does not need to be checked', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '1.3.4',
        dep4: '1.2.5',
      },
      dummyObject: {
        dep5: '^1.3.4',
        dep6: '~1.3.4',
      },
    },
    null,
    '\t',
  );

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new ExactNpmVersion().shouldBeApplied()).toBeFalsy();
});

test('Should replace ^ or ~ in package.json', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '^0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '~1.3.4',
        dep4: '1.2.5',
      },
    },
    null,
    '\t',
  );

  const correctedJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '1.3.4',
        dep4: '1.2.5',
      },
    },
    null,
    '\t',
  );

  fs.readFileSync.mockReturnValue(packageJSON);

  let correctSemverNotation;
  fs.writeFileSync.mockImplementation((_P: string, correct: string) => {
    correctSemverNotation = correct;
  });
  new ExactNpmVersion().apply();
  expect(correctSemverNotation).toEqual(correctedJSON);
});

test('Should not replace ^ or ~ in package.json for object that does not need to be corrected', () => {
  const packageJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '~0.5.4',
      },
      mockDep2: {
        dep3: '^1.3.4',
        dep4: '1.2.5',
      },
      dummyObject: {
        dep5: '^1.3.4',
        dep6: '~1.3.4',
      },
    },
    null,
    '\t',
  );

  const correctedJSON = JSON.stringify(
    {
      mockDep1: {
        dep1: '0.3.4',
        dep2: '0.5.4',
      },
      mockDep2: {
        dep3: '1.3.4',
        dep4: '1.2.5',
      },
      dummyObject: {
        dep5: '^1.3.4',
        dep6: '~1.3.4',
      },
    },
    null,
    '\t',
  );

  fs.readFileSync.mockReturnValue(packageJSON);

  let correctSemverNotation;
  fs.writeFileSync.mockImplementation((_P: string, correct: string) => {
    correctSemverNotation = correct;
  });

  new ExactNpmVersion().apply();
  expect(correctSemverNotation).toEqual(correctedJSON);
});
