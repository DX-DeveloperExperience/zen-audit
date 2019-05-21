import { ListStacks } from '../../stacks/list-stacks/index';
import Stack from '../../stacks/stack';
import { VSCodeExtensions } from './index';

const rootPath = 'root/';

require('constants');
jest.mock('./constants');

const fs = require('fs');
jest.mock('fs');

afterEach(() => {
  jest.resetAllMocks();
});

test('Method getChoices should give us a list of choices corresponding to stacks', () => {
  ListStacks.getStacksIn = jest.fn(() => {
    return [
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
    ];
  });

  const vsCodeExtensions = new VSCodeExtensions(rootPath);

  const choices = vsCodeExtensions.getChoices();
  expect(choices.length).toEqual(2);
});

test('Method getChoices should not add already existing extensions in choice list', () => {
  const extensionsJSON = JSON.stringify({
    recommendations: ['ext1'],
  });

  fs.readFileSync.mockImplementation(() => {
    return extensionsJSON;
  });

  ListStacks.getStacksIn = jest.fn(() => {
    return [
      {
        name() {
          return 'stack1';
        },
      } as Stack,
    ];
  });

  const vsCodeExtensions = new VSCodeExtensions(rootPath);

  const choices = vsCodeExtensions.getChoices();

  expect(choices.length).toEqual(1);
  expect(choices[0].value).toEqual('ext2');
});
