import { FileNotReadableError } from '../../errors/FileNotReadableError';
import { Husky } from '.';
import { Node } from '../../stacks/node/index';

const fs = require('fs');
jest.mock('fs');

test('shouldBeApplied() should return true if package.json does not contain devDependencies', () => {
  const packageJSON = {
    dependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
    dummy: {
      dep1: 'dep1',
    },
  };

  const husky = new Husky();
  husky.parsedPackage = jest.fn(() => {
    return packageJSON;
  });

  expect(husky.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied() should return true if husky is not in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  };

  const husky = new Husky();
  husky.parsedPackage = jest.fn(() => {
    return packageJSON;
  });

  expect(husky.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return false if husky is in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      husky: 'dev1',
    },
  };

  const husky = new Husky();
  husky.parsedPackage = jest.fn(() => {
    return packageJSON;
  });

  expect(husky.shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return true if husky is something else than a dependency in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'husky',
      dep2: 'dep2',
    },
    other: {
      husky: 'husky',
    },
  };

  const husky = new Husky();
  husky.parsedPackage = jest.fn(() => {
    return packageJSON;
  });

  expect(husky.shouldBeApplied()).toBeTruthy();
});
