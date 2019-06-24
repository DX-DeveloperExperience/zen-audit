import { Prettier } from '../../rules/prettier';
import Globals from '../../utils/globals/index';

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('Should return true if prettier is not in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      dep2: 'dep2',
    },
  };
  Globals.rootPath = './test1/';

  jest.mock('./test1/package.json', () => packageJSON, { virtual: true });

  return new Prettier().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('Should return false if prettier is in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      dep1: 'dep1',
      prettier: 'dev1',
    },
  };

  jest.mock(`${Globals.rootPath}package.json`, () => packageJSON, {
    virtual: true,
  });

  return new Prettier().shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
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

  jest.mock(`${Globals.rootPath}package.json`, () => packageJSON, {
    virtual: true,
  });

  return new Prettier().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});
