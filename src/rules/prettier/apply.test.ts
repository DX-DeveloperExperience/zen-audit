import { Prettier } from '.';

const rootPath = './prettier/';

const util = require('util');

const cp = require('child_process');
jest.mock('child_process');

require('../../logger');
jest.mock('../../logger');

test('Should run npm i prettier -DE command', () => {
  jest.mock(rootPath + 'package.json', () => ({}), { virtual: true });

  const prettier = new Prettier(rootPath);

  util.promisify = jest.fn((exec: (cmd: string) => {}) => {
    return (cmd: string) => {
      exec(cmd);
      return Promise.resolve();
    };
  });

  return prettier.apply(true).then(() => {
    expect(cp.exec).toBeCalled();
  });
});
