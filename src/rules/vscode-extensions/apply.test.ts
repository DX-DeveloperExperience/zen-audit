import { VSCodeExtensions } from '.';
import * as fs from 'fs';

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

  new VSCodeExtensions(rootPath).apply(['extension1', 'extension2']);

  expect(fs.lstatSync('root/.vscode').isDirectory()).toBeTruthy();
  expect(fs.lstatSync('root/.vscode/extensions.json').isFile()).toBeTruthy();

  const extensionsJSON = JSON.parse(
    fs.readFileSync('root/.vscode/extensions.json', {
      encoding: 'utf-8',
    }),
  );

  expect(extensionsJSON.recommendations[0]).toEqual('extension1');
  expect(extensionsJSON.recommendations[1]).toEqual('extension2');
});

test('should not add extensions if they already exist', () => {
  const extensionsJSON = {
    recommendations: ['extension1', 'extension2'],
  };

  jest.mock('root/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  new VSCodeExtensions(rootPath).apply(['extension1', 'extension3']);

  const extensionsJSONFinal = JSON.parse(
    fs.readFileSync('root/.vscode/extensions.json', {
      encoding: 'utf-8',
    }),
  );
  expect(extensionsJSONFinal.recommendations.length).toEqual(3);
  expect(extensionsJSONFinal.recommendations[0]).toEqual('extension1');
  expect(extensionsJSONFinal.recommendations[1]).toEqual('extension2');
  expect(extensionsJSONFinal.recommendations[2]).toEqual('extension3');
});
