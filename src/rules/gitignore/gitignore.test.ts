import { GitIgnore } from '../../rules/gitignore';
import { ListStacks } from '../../stacks/list-stacks/index';

const fs = require('fs-extra');
const axios = require('axios');

jest.mock('fs-extra');
jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

test('shouldBeApplied should return true if .gitignore file does not exist', () => {
  fs.readFile.mockImplementation(() => {
    return Promise.reject({ code: 'ENOENT' });
  });

  return new GitIgnore().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('shouldBeApplied should return true if .gitignore file exists but is empty', () => {
  fs.readFile.mockReturnValue(Promise.resolve(''));
  return new GitIgnore().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('shouldBeApplied should return true if .gitignore file does not contain every possible rule for a stack', () => {
  const gitignore: string =
    '# comment\n' +
    '# another comment\n' +
    'a/directory/to/ignore\n' +
    'another/directory/to/ignore';

  fs.readFile.mockReturnValue(Promise.resolve(gitignore));

  ListStacks.getStacksIn = jest.fn(() => {
    return Promise.resolve([
      {
        name(): string {
          return 'stack1';
        },
      } as any,
    ]);
  });

  axios.get.mockImplementation(() => {
    return Promise.resolve({
      data:
        '# comment\n' +
        'a/directory/to/ignore\n' +
        'a/directory/to/be/added/to/gitignore\n' +
        'another/directory/to/ignore\n' +
        'another/directory/to/be/added/to/gitignore',
    });
  });

  let resultGitignore: string;
  fs.writeFile.mockImplementation((_P: string, result: string) => {
    resultGitignore = result;
  });

  const gitIgnore = new GitIgnore();
  return gitIgnore.shouldBeApplied().then(result => {
    gitIgnore.apply();
    expect(resultGitignore).toEqual(
      '# comment\n' +
        '# another comment\n' +
        'a/directory/to/ignore\n' +
        'another/directory/to/ignore\n' +
        'a/directory/to/be/added/to/gitignore\n' +
        'another/directory/to/be/added/to/gitignore',
    );

    expect(result).toBeTruthy();
  });
});

test('shouldBeApplied should return false if .gitignore file contains every possible rules', () => {
  const gitignore: string =
    '# comment \n' +
    '# another comment \n' +
    'a/directory/to/ignore \n' +
    'another/directory/to/ignore';
  fs.readFileSync.mockReturnValue(gitignore);
  ListStacks.getStacksIn = jest.fn(() => {
    return Promise.resolve([
      {
        name(): string {
          return '';
        },
      } as any,
    ]);
  });
  axios.get.mockImplementation(() => {
    return Promise.resolve({
      data:
        '# comment\n' +
        'a/directory/to/ignore\n' +
        'another/directory/to/ignore',
    });
  });
  return new GitIgnore().shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
