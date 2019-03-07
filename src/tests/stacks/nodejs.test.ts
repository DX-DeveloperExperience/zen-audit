import NodeJS from '../../stacks/nodejs';

test('tests with empty path', () => {
  expect(NodeJS.prototype.existsInPaths([])).toBeFalsy();
});

test('tests with filename not at end of path', () => {
  const paths = ['dummy/path/to/package.json/not-at-end'];
  expect(NodeJS.prototype.existsInPaths(paths)).toBeFalsy();
});
