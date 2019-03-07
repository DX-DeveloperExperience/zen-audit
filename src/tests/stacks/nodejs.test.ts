import NodeJS from '../../stacks/nodejs';
test('tests with empty paths list should be falsy', () => {
  expect(new NodeJS().existsInPaths([])).toBeFalsy();
});

test('tests with filename not at end of path should be falsy', () => {
  const paths = ['dummy/path/to/package.json/not-at-end'];
  expect(new NodeJS().existsInPaths(paths)).toBeFalsy();
});

test('tests with filled paths list that does not contain package.json', () => {
  const paths = [
    'path/not/containing1',
    'path/not/containing2',
    'path/not/containing3',
  ];
  expect(new NodeJS().existsInPaths(paths)).toBeFalsy();
});

test('tests with package.json at end of path should be truthy', () => {
  const paths = [
    'bad/path/to/package.json/not-at-end',
    'right/path/to/package.json',
  ];
  expect(new NodeJS().existsInPaths(paths)).toBeFalsy();
});
