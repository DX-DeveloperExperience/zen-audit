import { Husky } from '.';
import Globals from '../../utils/globals/index';

Globals.rootPath = 'husky/';
const packageJSONPath = `${Globals.rootPath}package.json`;

afterEach(() => {
  jest.resetModules();
});

test('should return true if package.json does not contain devDependencies', () => {
  const packageJSON = {
    dependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
    dummy: {
      dep1: 'dep1',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  const husky = new Husky();
  return husky.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if husky is not in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  const husky = new Husky();
  return husky.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if husky is in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      husky: 'dev1',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  const husky = new Husky();
  return husky.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if husky is something else than a dependency in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'husky',
      dep2: 'dep2',
    },
    other: {
      husky: 'husky',
    },
  };

  jest.mock(packageJSONPath, () => packageJSON, { virtual: true });

  const husky = new Husky();
  return husky.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});
