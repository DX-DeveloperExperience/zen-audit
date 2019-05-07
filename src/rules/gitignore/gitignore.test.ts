import { GitIgnore } from '../../rules/gitignore';
import { ListStacks } from '../../stacks/list-stacks/index';

const fs = require('fs');
const request = require('sync-request');

jest.mock('fs');
jest.mock('sync-request');

afterEach(() => {
  jest.resetAllMocks();
});

test('shouldBeApplied should return true if .gitignore file does not exist', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  expect(new GitIgnore().shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return true if .gitignore file exists but is empty', () => {
  fs.readFileSync.mockReturnValue('');

  expect(new GitIgnore().shouldBeApplied()).toBeTruthy();
});

test('shouldBeApplied should return true if .gitignore file does not contain every possible rule for a stack', () => {
  const gitignore: string =
    '# comment\n' +
    '# another comment\n' +
    'a/directory/to/ignore\n' +
    'another/directory/to/ignore';

  fs.readFileSync.mockReturnValue(gitignore);

  ListStacks.getStacksIn = jest.fn(() => {
    return [
      {
        name(): string {
          return '';
        },
      } as any,
    ];
  });

  request.mockImplementation(() => {
    return {
      getBody() {
        return {
          toString() {
            return (
              '# comment\n' +
              'a/directory/to/ignore\n' +
              'a/directory/to/be/added/to/gitignore\n' +
              'another/directory/to/ignore\n' +
              'another/directory/to/be/added/to/gitignore'
            );
          },
        };
      },
    };
  });

  let resultGitignore;
  fs.writeFileSync.mockImplementation((_path: string, result: string) => {
    resultGitignore = result;
  });

  const gitIgnore = new GitIgnore();

  expect(gitIgnore.shouldBeApplied()).toBeTruthy();
  gitIgnore.apply();
  expect(resultGitignore).toEqual(
    '# comment\n' +
      '# another comment\n' +
      'a/directory/to/ignore\n' +
      'another/directory/to/ignore\n' +
      'a/directory/to/be/added/to/gitignore\n' +
      'another/directory/to/be/added/to/gitignore',
  );
});

test('shouldBeApplied should return false if .gitignore file contains every possible rules', () => {
  const gitignore: string =
    '# comment \n' +
    '# another comment \n' +
    'a/directory/to/ignore \n' +
    'another/directory/to/ignore';

  fs.readFileSync.mockReturnValue(gitignore);

  ListStacks.getStacksIn = jest.fn(() => {
    return [
      {
        name(): string {
          return '';
        },
      } as any,
    ];
  });

  request.mockImplementation(() => {
    return {
      getBody() {
        return {
          toString() {
            return (
              '# comment\n' +
              'a/directory/to/ignore\n' +
              'another/directory/to/ignore'
            );
          },
        };
      },
    };
  });

  expect(new GitIgnore().shouldBeApplied()).toBeFalsy();
});
