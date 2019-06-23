import { Website } from './index';
import Globals from '../../utils/globals';
const axios = require('axios');

afterEach(() => {
  jest.resetAllMocks();
});

test('should return false if path does not start with http or https', () => {
  Globals.rootPath = 'path/to/project';

  const website = new Website();

  return website.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return false if response is not html text', () => {
  Globals.rootPath = 'http://unknown-path.test';

  axios.get = jest.fn(() => {
    return Promise.resolve({
      headers: { 'content-type': 'other/other; charset=ISO-79569' },
    });
  });

  const website = new Website();

  return website.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if path starts with http:// or https:// and response is text/html', () => {
  Globals.rootPath = 'https://unknown-path.test';

  axios.get = jest.fn(() => {
    return Promise.resolve({
      headers: { 'content-type': 'text/html; charset=ISO-79569' },
    });
  });

  const website = new Website();

  return website.isAvailable().then(result => {
    expect(result).toBeTruthy();
  });
});
