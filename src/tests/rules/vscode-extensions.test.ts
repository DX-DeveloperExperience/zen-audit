import { VSCodeExtensions } from '../../rules/vscode-extensions';
import { ListStacks } from '../../stacks/list-stacks';
jest.mock('../../stacks/list-stacks');

const fs = require('fs');
jest.mock('fs');

test('Method shouldBeApplied() should return true if .vscode/extensions.json does not exist', () => {
  fs.readFileSync.mockImplementation(() => {
    throw { code: 'ENOENT' };
  });

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json is empty', () => {
  fs.readFileSync.mockReturnValue('');

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json has no recommendations array', () => {
  const extensionsJSON = JSON.stringify({
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: {
      key1: 'value1',
    },
  });

  fs.readFileSync.mockReturnValue(extensionsJSON);

  const vscext = new VSCodeExtensions();
  expect(vscext.shouldBeApplied()).toBeTruthy();
});

test('Method shouldBeApplied() should return true if .vscode/extensions.json contains an empty "recommendations" array', () => {
  const extensionsJSON = JSON.stringify({
    array1: ['value1', 'value2'],
    object1: {
      key1: 'value1',
      key2: 'value2',
    },
    recommendations: [],
  });

  fs.readFileSync.mockReturnValue(extensionsJSON);

  expect(new VSCodeExtensions().shouldBeApplied()).toBeTruthy();
});
