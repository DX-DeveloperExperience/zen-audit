import { GitHubTemplates } from './index';
const fs = require('fs-extra');
jest.mock('fs-extra');

const rootPath = 'github/';

afterEach(() => {
  jest.resetAllMocks();
});

test('Should return true if .github/ISSUE_TEMPLATE folder does not exist', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(false));

  const templates = new GitHubTemplates(rootPath);

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return true if .github/ISSUE_TEMPLATE is empty', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(true));
  fs.readdir.mockReturnValue(Promise.resolve([]));

  const templates = new GitHubTemplates(rootPath);

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return true if .github/ISSUE_TEMPLATE is not empty but has no .md', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(true));
  fs.readdir.mockReturnValue(
    Promise.resolve(['a_file.ts', 'a_file.testmd', 'a_file']),
  );

  const templates = new GitHubTemplates(rootPath);

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return false if .github/ISSUE_TEMPLATE contains .md files', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(true));
  fs.readdir.mockReturnValue(
    Promise.resolve([
      'a_file.ts',
      'template_file.md',
      'another_file',
      'another_template.md',
    ]),
  );

  const templates = new GitHubTemplates(rootPath);

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});
