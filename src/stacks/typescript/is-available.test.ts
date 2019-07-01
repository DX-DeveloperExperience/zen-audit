import TypeScript from '.';
import Globals from '../../utils/globals';

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return false if typescript not in devDependencies', () => {
  const packageJSON = {
    dependencies: {
      typescript: '',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  const typescript = new TypeScript();

  return typescript.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if typescript in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      typescript: '',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  const typescript = new TypeScript();

  return typescript.isAvailable().then(result => {
    expect(result).toBeTruthy();
  });
});
