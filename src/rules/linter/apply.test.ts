import { Linter } from './index';
import { TypeScript } from '../../stacks/typescript';
const rootPath = 'linter/';

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

const cp = require('child_process');
jest.mock('child_process');

jest.mock('fs-extra');

test('should install tslint as devDependencies and create tslint.json', () => {
  const packageJSON = {
    devDependencies: {
      typescript: 'test',
    },
  };
  jest.mock('linter/package.json', () => packageJSON, { virtual: true });
  const linterRule = new Linter(rootPath);

  linterRule.shouldBeApplied = jest.fn(() => {
    return Promise.resolve(true);
  });

  new TypeScript(rootPath).isAvailable = jest.fn(() => {
    return Promise.resolve(true);
  });

  return linterRule.apply().then(() => {
    expect(cp.exec).toBeCalled();
  });
});
