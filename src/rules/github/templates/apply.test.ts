import { GitHubTemplates } from '.';

const fs = require('fs-extra');
jest.mock('fs-extra');

require('../../../logger');
jest.mock('../../../logger');

const rootPath = 'github/';
const templateDirPath = rootPath + '.github/ISSUE_TEMPLATE/';

test('Should ensure .github/ISSUE_TEMPLATE existence and create default template files', () => {
  const templates = new GitHubTemplates(rootPath);

  fs.ensureDir.mockReturnValue(Promise.resolve());
  fs.copy.mockReturnValue(Promise.resolve());

  return templates.apply(true).then(() => {
    expect(fs.ensureDir).toBeCalledWith(templateDirPath);
    expect(fs.copy).toBeCalledWith(
      `${__dirname}/template_files`,
      templateDirPath,
    );
  });
});
