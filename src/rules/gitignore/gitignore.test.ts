import { GitIgnore } from '../../rules/gitignore';

const fs = require('fs');

jest.mock('fs');

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
