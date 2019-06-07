import Node from '../../stacks/node/index';
import { Husky } from './index';

const rootPath = './husky/';

const util = require('util');

const cp = require('child_process');
jest.mock('child_process');

const fs = require('fs-extra');
jest.mock('fs-extra');

require('../../logger');
jest.mock('../../logger');

afterEach(() => {
  jest.resetModules();
});

test('Method apply() should add husky to devDependencies', () => {
  jest.mock('./husky/package.json', () => ({}), { virtual: true });

  const husky = new Husky(rootPath);
  const node = new Node(rootPath);

  node.isAvailable = jest.fn(() => {
    return Promise.resolve(true);
  });

  util.promisify = jest.fn((exec: (cmd: string) => {}) => {
    return (cmd: string) => {
      exec(cmd);
      return Promise.resolve();
    };
  });

  return husky.apply(true).then(() => {
    expect(cp.exec).toBeCalled();
  });
});
