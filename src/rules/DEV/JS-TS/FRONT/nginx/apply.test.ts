import Globals from '../../../../../utils/globals';
import Nginx from '.';

const fs = require('fs-extra');

jest.mock('fs-extra');

jest.mock('inquirer');

jest.mock('./../../../../../logger/index');

Globals.rootPath = 'test/nginx';
const confDirPath = Globals.rootPath + 'config';
const confFilePath = confDirPath + '/nginx.conf';

test("should copy file to project's config folder", () => {
  fs.ensureDir = jest.fn(path => {
    expect(path).toBe(confDirPath);
    return Promise.resolve();
  });

  fs.copy = jest.fn((from, to) => {
    expect(from).toBe(__dirname + 'nginx.conf');
    expect(to).toBe(confFilePath);
    return Promise.resolve();
  });

  new Nginx()
    .apply(true)
    .then(() => {
      /** */
    })
    .catch(() => {
      /* */
    });
});
