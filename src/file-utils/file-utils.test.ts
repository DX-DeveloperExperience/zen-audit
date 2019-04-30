import FileUtils from '.';

const mockFS = require('mock-fs');

mockFS({
  root: {
    folder1: {
      'file1-1.ts': '',
      'file1-2.ts': '',
      'folder1-1': {
        'file1-1-1.ts': '',
      },
    },
    folder2: {
      'folder2-1': {
        'folder2-1-1': {
          'file2-1-1-1.ts': '',
        },
      },
    },
  },
});

afterAll(() => {
  mockFS.restore();
});

test('findFilesRecursively to return false if file is not in file tree', () => {
  expect(
    FileUtils.findFileRecursively('root', 'UnexistingFile.ts'),
  ).toBeFalsy();
});

test('findFilesRecursively should return true if file is in file tree', () => {
  expect(FileUtils.findFileRecursively('root', 'file2-1-1-1.ts')).toBeTruthy();
  expect(FileUtils.findFileRecursively('root', 'file1-1.ts')).toBeTruthy();
});
