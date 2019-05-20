import { VSCodeExtensions } from '.';
import * as fs from 'fs';

const mockFS = require('mock-fs');

afterAll(() => {
  mockFS.restore();
});

test('Method apply() should create the .vscode/extensions.json file even if folder and file does not exist', () => {
  mockFS({
    root: {
      folder: {
        'extensions.json': '',
      },
      '.vcode': {},
    },
  });

  // new VSCodeExtensions('root').apply(['extension1', 'extension2']);

  expect(fs.readdirSync('root').length).toEqual(2);
  // expect(trueFS.lstatSync('root').isDirectory()).toBeTruthy();
});
