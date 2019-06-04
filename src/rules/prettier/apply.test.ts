import { Prettier } from '.';

const rootPath = './prettier';

const util = require('util');
jest.mock('util');

const cp = require('child_process');
jest.mock('child_process');

test('Should run npm i prettier -DE command', () => {
  jest.mock(rootPath + 'package.json', () => {}, { virtual: true });

  const prettier = new Prettier(rootPath);

  util.promisify.mockImplementation((exec: (cmd: string) => {}) => {
    return (cmd: string) => {
      exec(cmd);
      return Promise.resolve();
    };
  });

  return prettier.apply().then(() => {
    expect(cp.exec).toBeCalled();
  });
});
