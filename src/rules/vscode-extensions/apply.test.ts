import { VSCodeExtensions } from '.';
import * as fs from 'fs-extra';

const mockFS = require('mock-fs');

afterAll(() => {
  mockFS.restore();
});

const rootPath = 'root/';

test('should create the .vscode/extensions.json file with recommendations even if folder and file does not exist', () => {
  mockFS({
    root: {
      folder: {
        'extensions.json': '',
      },
      '.vcode': {},
    },
  });

  function vscodeIsDirectory() {
    fs.lstatSync('root/.vscode').isDirectory();
  }

  function extensionsIsFile() {
    fs.lstatSync('root/.vscode/extensions.json').isFile();
  }

  expect(vscodeIsDirectory).toThrow();
  expect(extensionsIsFile).toThrow();

  return new VSCodeExtensions(rootPath)
    .apply(['extension1', 'extension2'])
    .then(() => {
      expect(fs.lstatSync('root/.vscode').isDirectory()).toBeTruthy();
      expect(
        fs.lstatSync('root/.vscode/extensions.json').isFile(),
      ).toBeTruthy();
      return fs
        .readFile('root/.vscode/extensions.json', { encoding: 'utf-8' })
        .then(result => {
          const extensionsJSON = JSON.parse(result);
          expect(extensionsJSON.recommendations[0]).toEqual('extension1');
          expect(extensionsJSON.recommendations[1]).toEqual('extension2');
        });
    });
});

test('should not add extensions if they already exist', () => {
  const extensionsJSON = {
    recommendations: ['extension1', 'extension2'],
  };

  jest.mock('root/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  return new VSCodeExtensions(rootPath)
    .apply(['extension1', 'extension3'])
    .then(() => {
      return fs
        .readFile('root/.vscode/extensions.json', { encoding: 'utf-8' })
        .then(result => {
          const extensionsJSONRead = JSON.parse(result);
          expect(extensionsJSONRead.recommendations.length).toEqual(3);
          expect(extensionsJSONRead.recommendations[0]).toEqual('extension1');
          expect(extensionsJSONRead.recommendations[1]).toEqual('extension2');
          expect(extensionsJSONRead.recommendations[2]).toEqual('extension3');
        });
    });
});
