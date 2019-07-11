import { StackRegister } from '../stack-register';
import * as fs from 'fs-extra';
import Globals from '../../utils/globals';
import { execInRootpath } from '../../utils/commands';

@StackRegister.register
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
        err.message = `GitHub Stack: Error trying to get informations on directory: ${
          Globals.rootPath
        }.git`;
        throw err;
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
