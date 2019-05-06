import { GitIgnore } from '../../rules/gitignore';

const fs = require('fs');
const request = require('sync-request');

jest.mock('fs');
jest.mock('sync-request');

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
    '# comment \
    # another comment \
    a/directory/to/ignore \
    another/directory/to/ignore';

  fs.readFileSync.mockReturnValue(gitignore);

  request.getBody.toString.mockImplementation(() => {
    return '# comment \
            a/directory/to/ignore \
            another/directory/to/ignore \
            a/third/directory/to/ignore';
  });

  expect(new GitIgnore().shouldBeApplied()).toBeTruthy();
});
