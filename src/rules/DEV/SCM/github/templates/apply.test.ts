import { GitHubTemplates } from '../templates';
import Globals from '../../../../../utils/globals/index';

const fs = require('fs-extra');
jest.mock('fs-extra');

require('../../../../../logger');
jest.mock('../../../../../logger');

jest.mock('./constants');

Globals.rootPath = 'github/';
const templateDirPath = Globals.rootPath + '.github/ISSUE_TEMPLATE/';

test('Should ensure .github/ISSUE_TEMPLATE existence and create default template files', () => {
  const templates = new GitHubTemplates();

  fs.ensureDir.mockReturnValue(Promise.resolve());
  fs.writeFile.mockReturnValue(Promise.resolve());

  return templates.apply(true).then(() => {
    expect(fs.ensureDir).toBeCalledWith(templateDirPath);
    expect(fs.writeFile).toBeCalledWith(
      `${templateDirPath}bug_report.md`,
      'bugReport',
      { encoding: 'utf-8' },
    );
    expect(fs.writeFile).toBeCalledWith(
      `${templateDirPath}feature_request.md`,
      'featureRequest',
      { encoding: 'utf-8' },
    );
    expect(fs.writeFile).toBeCalledWith(
      `${templateDirPath}custom.md`,
      'custom',
      { encoding: 'utf-8' },
    );
  });
});
