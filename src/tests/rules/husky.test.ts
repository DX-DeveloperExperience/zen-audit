import { Husky } from '../../rules/husky';

const fs = require('fs');
jest.mock('fs');

test('Should return false if husky is not in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().isInDevDep()).toBeFalsy();
});

test('Should return true if husky is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      husky: 'dev1',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().isInDevDep()).toBeTruthy();
});

test('Should return false if husky is something else than a dependency in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'husky',
      dep2: 'dep2',
    },
    other: {
      husky: 'husky',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Husky().isInDevDep()).toBeFalsy();
});
