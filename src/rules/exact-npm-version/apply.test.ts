import { ExactNpmVersion } from '.';

const fs = require('fs-extra');

jest.mock('fs-extra');
jest.mock('./constants');

require('../../logger');
jest.mock('../../logger');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const rootPath = './exact-npm-version/';

test('Should replace ^ or ~ in package.json', () => {
  const packageJSON = {
    mockDep1: {
      dep1: '^0.3.4',
      dep2: '0.5.4',
    },
    mockDep2: {
      dep3: '~1.3.4',
      dep4: '1.2.5',
    },
  };
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

  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  let correctSemverNotation: string;
  fs.writeFile.mockImplementation((_P: string, correct: string) => {
    correctSemverNotation = correct;
    return Promise.resolve();
  });

  return new ExactNpmVersion(rootPath).apply(true).then(() => {
    expect(correctSemverNotation).toEqual(correctedJSON);
  });
});

test('Should not replace ^ or ~ in package.json for object that does not need to be corrected', () => {
  const packageJSON = {
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
  };

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

  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  let correctSemverNotation: string;
  fs.writeFile.mockImplementation((_P: string, correct: string) => {
    correctSemverNotation = correct;
    return Promise.resolve();
  });

  return new ExactNpmVersion(rootPath).apply(true).then(() => {
    expect(correctSemverNotation).toEqual(correctedJSON);
  });
});
