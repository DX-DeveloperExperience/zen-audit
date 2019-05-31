import { Prettier } from '../../rules/prettier';

beforeEach(() => {
  jest.resetAllMocks();
});

test('Should return true if prettier is not in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  };
  const path: string = './test1/';

  jest.mock('./test1/package.json', () => packageJSON, { virtual: true });

  expect(new Prettier(path).shouldBeApplied()).toBeTruthy();
});

test('Should return false if prettier is in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      prettier: 'dev1',
    },
  };
  const path: string = './test2/';

  jest.mock(`./test2/package.json`, () => packageJSON, { virtual: true });

  expect(new Prettier(path).shouldBeApplied()).toBeFalsy();
});

test('Should return true if prettier is something else than a dependency in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'prettier',
      dep2: 'dep2',
    },
    other: {
      prettier: 'prettier',
    },
  };
  const path: string = './test3/';

  jest.mock(`./test3/package.json`, () => packageJSON, { virtual: true });

  expect(new Prettier(path).shouldBeApplied()).toBeTruthy();
});
