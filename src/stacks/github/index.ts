import { StackRegister } from '../stack-register';
import * as fs from 'fs-extra';
import Globals from '../../utils/globals';
import { execInRootpath } from '../../utils/commands';

@StackRegister.register
export default class GitHub {
  async isAvailable(): Promise<boolean> {
    return fs
      .lstat(`${Globals.rootPath}.git`)
      .catch(err => {
        err.message = `GitHub Stack: Error trying to get informations on directory: ${
          Globals.rootPath
        }.git`;
        throw err;
      })
      .then(lstat => {
        if (!lstat.isDirectory()) {
          return false;
        }
        return execInRootpath(`git remote -v`)
          .then((value: { stdout: string }) => {
            return value.stdout.includes('github.com');
          })
          .catch(err => {
            err.message = `GitHub Stack: Error trying to execute "git remote -v" command`;
            throw err;
          });
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          return false;
        }
        throw err;
      });
  }

  name() {
    return this.constructor.name;
  }
}
