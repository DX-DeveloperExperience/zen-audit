import { VSCodeExtensions } from '.';

const fs = require('fs-extra');
jest.mock('fs-extra');

const rootPath = 'root/';

test('should not add extensions if they already exist', () => {
  const extensionsJSON = {
    recommendations: ['extension1', 'extension2'],
  };

  jest.mock('root/.vscode/extensions.json', () => extensionsJSON, {
    virtual: true,
  });

  const vscodeExtensions = new VSCodeExtensions(rootPath);

  let writtenJSON: string;
  fs.writeJSON.mockImplementation((_A: string, resultJSON: any, _B: {}) => {
    writtenJSON = JSON.stringify(resultJSON);
  });

  fs.ensureFile.mockImplementation(() => {
    return Promise.resolve();
  });

  const expected = JSON.stringify({
    recommendations: ['extension1', 'extension2', 'extension3'],
  });

  return vscodeExtensions
    .apply(['extension1', 'extension2', 'extension3'])
    .then(() => {
      expect(writtenJSON).toEqual(expected);
    });
});
