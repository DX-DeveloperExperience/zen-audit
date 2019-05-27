import { ExactNpmVersion } from '.';
jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const rootPath = './exact-npm-version/';

test('shouldBeApplied() should return false if package.json not found', () => {
  return new ExactNpmVersion(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('Should return false if no incorrect semver is found', () => {
  const packageJSON = {
    mockDep1: {
      dep1: '0.2.3',
      dep2: '0.3.0',
    },
    mockDep2: {
      dep3: '1.3.4',
      dep4: '1.2.5',
    },
  };
  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  return new ExactNpmVersion(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('Should return true if incorrect semver with ^ is found', () => {
  const packageJSON = {
    mockDep1: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    mockDep2: {
      dep3: '^1.3.4',
      dep4: '1.2.5',
    },
  };

  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  return new ExactNpmVersion(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('Should return true if incorrect semver with ~ is found', () => {
  const packageJSON = {
    mockDep1: {
      dep1: '0.3.4',
      dep2: '0.5.4',
    },
    mockDep2: {
      dep3: '~1.3.4',
      dep4: '1.2.5',
    },
  };

  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  return new ExactNpmVersion(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('Should return false if incorrect semver is in json object that does not need to be checked', () => {
  const packageJSON = {
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
  };

  jest.mock('./exact-npm-version/package.json', () => packageJSON, {
    virtual: true,
  });

  return new ExactNpmVersion(rootPath).shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
