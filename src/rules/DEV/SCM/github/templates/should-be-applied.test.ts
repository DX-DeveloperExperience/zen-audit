import { GitHubTemplates } from './index';
import Globals from '../../../../../utils/globals/index';
const fs = require('fs-extra');
jest.mock('fs-extra');

Globals.rootPath = 'github/';

afterEach(() => {
  jest.resetAllMocks();
});

test('Should return true if .github/ISSUE_TEMPLATE folder does not exist', () => {
  fs.readdir.mockReturnValue(Promise.reject({ code: 'ENOENT' }));

  const templates = new GitHubTemplates();

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE.md');
  });
});

test('Should return true if .github/ISSUE_TEMPLATE is empty', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(false));
  fs.readdir.mockReturnValue(Promise.resolve([]));

  const templates = new GitHubTemplates();

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE.md');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return true if .github/ISSUE_TEMPLATE is not empty but has no .md', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(false));
  fs.readdir.mockReturnValue(
    Promise.resolve(['a_file.ts', 'a_file.testmd', 'a_file']),
  );

  const templates = new GitHubTemplates();

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE.md');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return false if .github/ISSUE_TEMPLATE contains .md files', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(false));
  fs.readdir.mockReturnValue(
    Promise.resolve([
      'a_file.ts',
      'template_file.md',
      'another_file',
      'another_template.md',
    ]),
  );

  const templates = new GitHubTemplates();

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE.md');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});

test('Should return false if .github/ has ISSUE_TEMPLATE.md file and .github/ISSUE_TEMPLATE/ does not exist', () => {
  fs.pathExists.mockReturnValue(Promise.resolve(true));
  fs.readdir.mockReturnValue(Promise.reject({ code: 'ENOENT' }));

  const templates = new GitHubTemplates();

  return templates.shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
    expect(fs.pathExists).toBeCalledWith('github/.github/ISSUE_TEMPLATE.md');
    expect(fs.readdir).toBeCalledWith('github/.github/ISSUE_TEMPLATE/');
  });
});
