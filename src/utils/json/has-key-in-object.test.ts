import { hasKeyInObject } from './index';
const JSONFilePath = 'test/test.json';

afterEach(() => {
  jest.resetModules();
});

test('should return false if JSON file does not exist', () => {
  expect(hasKeyInObject(JSONFilePath, 'testObj', 'testKey')).toBeFalsy();
});

test('should return false if JSON file is empty', () => {
  jest.mock(JSONFilePath, () => ({}), { virtual: true });

  expect(hasKeyInObject(JSONFilePath, 'testObj', 'testKey')).toBeFalsy();
});

test('should return false if key to find not direct child of given object', () => {
  const mockJSON = {
    obj: {
      dep1: 'dep1Val',
      dep2: 'dep2Val',
      subObject: {
        keyToFind: 'val',
      },
    },
    keyToFind: 'val',
    otherObject: {
      keyTofind: 'val',
    },
  };

  jest.mock(JSONFilePath, () => mockJSON, { virtual: true });

  expect(hasKeyInObject(JSONFilePath, 'obj', 'keyToFind')).toBeFalsy();
});

test('should return false if obj does not exist', () => {
  const mockJSON = {
    notObj: {
      dep1: 'dep1Val',
      dep2: 'dep2Val',
      subObject: {
        keyToFind: 'val',
      },
    },
    keyToFind: 'val',
    otherObject: {
      keyTofind: 'val',
    },
  };

  jest.mock(JSONFilePath, () => mockJSON, { virtual: true });

  expect(hasKeyInObject(JSONFilePath, 'obj', 'keyToFind')).toBeFalsy();
});

test('should return true if key to find is direct child of given object', () => {
  const mockJSON = {
    obj: {
      dep1: 'dep1Val',
      dep2: 'dep2Val',
      keyToFind: 'val',
    },
  };

  jest.mock(JSONFilePath, () => mockJSON, { virtual: true });

  expect(hasKeyInObject(JSONFilePath, 'obj', 'keyToFind')).toBeTruthy();
});
