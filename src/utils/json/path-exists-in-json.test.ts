import { pathExistsInJSON } from './index';
test('should return false if path does not exist', () => {
  const parsedJSON = {
    user: {
      data: {
        firstname: '',
      },
    },
  };

  expect(
    pathExistsInJSON(parsedJSON, ['user', 'data', 'lastname']),
  ).toBeFalsy();
});

test('should return true if path exists', () => {
  const parsedJSON = {
    test: {
      test2: {
        test3: {},
      },
    },
  };

  expect(pathExistsInJSON(parsedJSON, ['test', 'test2', 'test3'])).toBeTruthy();
});
