import Prettier from '../../rules/prettier';

const fs = require('fs');
jest.mock('fs');

test('Should return false if prettier is not in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeFalsy();
});

test('Should return true if prettier is in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'dep1',
      prettier: 'dev1',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeTruthy();
});

test('Should return false if prettier is something else than a dependency in devDependencies', () => {
  const packageJSON = JSON.stringify({
    devDependencies: {
      dep1: 'prettier',
      dep2: 'dep2',
    },
    other: {
      prettier: 'prettier',
    },
  });

  fs.readFileSync.mockReturnValue(packageJSON);

  expect(new Prettier().isInDevDep()).toBeFalsy();
});
