import * as fs from 'fs-extra';
import Globals from '../../utils/globals';
import { execInRootpath } from '../../utils/commands';
import { DirError } from '../../errors/dir-errors';
import { Register } from '../../register';

@Register.stack
export default class GitHub {
  async isAvailable(): Promise<boolean> {
    return this.dotGitExists()
      .then(dotGitExists => {
        return dotGitExists && this.gitIsInstalled();
      })
      .catch(err => {
        throw err;
      });
  }

  async dotGitExists() {
    return fs
      .lstat(`${Globals.rootPath}.git`)
      .then(lstat => {
        return lstat.isDirectory();
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          return false;
        }
        throw new DirError(
          err,
          `${Globals.rootPath}.git`,
          this.constructor.name,
        );
      });
  }

  async gitIsInstalled() {
    return execInRootpath(`git remote -v`)
      .then((value: { stdout: string }) => {
        return value.stdout.includes('github.com');
      })
      .catch(err => {
        err.message = `GitHub Stack: Error trying to execute "git remote -v" command`;
        throw err;
      });
  }

  name() {
    return this.constructor.name;
  }
}
