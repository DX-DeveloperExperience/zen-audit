import GitHub from '.';

const commands = require('../../utils/commands');

const fs = require('fs-extra');
const util = require('util');

afterEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

test('should return false if .git directory does not exist', () => {
  fs.lstat = jest.fn(() => {
    return Promise.resolve({
      isDirectory() {
        return false;
      },
    });
  });

  const github = new GitHub();

  return github.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return false if "git remote -v" command does not return a result from github', () => {
  commands.execInRootpath = jest.fn(async (cmd: string) => {
    expect(cmd).toBe('git remote -v');
    return { stdout: 'bad result' };
  });

  fs.lstat = jest.fn(() => {
    return Promise.resolve({
      isDirectory() {
        return true;
      },
    });
  });

  const github = new GitHub();

  return github.isAvailable().then(result => {
    expect(result).toBeFalsy();
  });
});

test('should return true if .git exists and "git remote -v" command returns a string containing github.com', () => {
  commands.execInRootpath = jest.fn(async (cmd: string) => {
    expect(cmd).toBe('git remote -v');
    return { stdout: 'github.com' };
  });

  fs.lstat = jest.fn(() => {
    return Promise.resolve({
      isDirectory() {
        return true;
      },
    });
  });

  const github = new GitHub();

  return github.isAvailable().then(result => expect(result).toBeTruthy());
});
