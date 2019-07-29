import { LightHouse } from './index';
import Globals from '../../../../utils/globals';

Globals.rootPath = 'lighthouse/';

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return true if lighthouse not in devDependencies', () => {
  const packageJSON = {
    devDependencies: {
      'not-lighthouse': 'version',
      other: 'version',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  return new LightHouse().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return true if lighthouse in devDependencies but no script named lighthouse', () => {
  const packageJSON = {
    devDependencies: {
      lighthouse: 'version',
    },
    scripts: {
      'not-lighthouse': 'script',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  return new LightHouse().shouldBeApplied().then(result => {
    expect(result).toBeTruthy();
  });
});

test('should return false if lighthouse is in devDependencies and there is a script named lighthouse', () => {
  const packageJSON = {
    devDependencies: {
      lighthouse: 'version',
    },
    scripts: {
      lighthouse: 'script',
    },
  };

  jest.mock(Globals.packageJSONPath, () => packageJSON, { virtual: true });

  return new LightHouse().shouldBeApplied().then(result => {
    expect(result).toBeFalsy();
  });
});
