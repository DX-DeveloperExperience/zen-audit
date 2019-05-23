import { Node } from '../../stacks/node/index';
import { Husky } from './index';
import * as fs from 'fs';
import * as Path from 'path';
import FileUtils from '../../file-utils/index';

const rootPath = Path.resolve('./src/rules/husky/__mocks__/') + '/';

const packageJSON = {
  devDependencies: { dep1: 'dep1', dep2: 'dep2' },
  otherDep: { other: 'other' },
};

beforeEach(() => {
  fs.mkdirSync(rootPath);
  fs.writeFileSync(
    `${rootPath}package.json`,
    JSON.stringify(packageJSON, null, '\t'),
  );
});

afterEach(() => {
  FileUtils.deleteRecursively(rootPath);
});

jest.setTimeout(60000);

test('Method apply() should add husky to devDependencies', () => {
  const husky = new Husky(rootPath);
  const node = new Node(rootPath);
  expect(node.isAvailable()).toBeTruthy();

  return husky.apply().then(() => {
    const packageJSON = fs.readFileSync(`${rootPath}package.json`, {
      encoding: 'utf-8',
    });
    const parsedPackage = JSON.parse(packageJSON);

    expect(parsedPackage.devDependencies.husky).toBeDefined();
    expect(parsedPackage.husky.hooks['pre-push']).toEqual('exit 1');
  });
});
