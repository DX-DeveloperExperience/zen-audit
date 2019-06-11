import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack';
import { VSCodeExtensions } from './index';

const rootPath = 'root/';

require('constants');
jest.mock('./constants');

afterEach(() => {
  jest.resetAllMocks();
});

test('should give us a list of choices corresponding to stacks', () => {
  ListStacks.getAvailableStacksIn = jest.fn(() => {
    return Promise.resolve([
      {
        name() {
          return 'stack1';
        },
      } as Stack,
      {
        name() {
          return 'stack3';
        },
      } as Stack,
    ]);
  });

  const vsCodeExtensions = new VSCodeExtensions(rootPath);

  return vsCodeExtensions.getChoices().then(choices => {
    expect(choices.length).toEqual(2);
  });
});

test('should not add already existing extensions in choice list', () => {
  const extensionsJSON = {
    recommendations: ['ext1'],
  };

  jest.mock('root/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  ListStacks.getAvailableStacksIn = jest.fn(() => {
    return Promise.resolve([
      {
        name() {
          return 'stack1';
        },
      } as Stack,
    ]);
  });

  const vsCodeExtensions = new VSCodeExtensions(rootPath);

  return vsCodeExtensions.getChoices().then(choices => {
    expect(choices.length).toEqual(1);
    expect(choices[0].value).toEqual('ext2');
  });
});
