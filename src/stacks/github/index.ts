import { StackRegister } from '../stack-register';
import * as util from 'util';
import * as cp from 'child_process';
import { logger } from '../../logger/index';
import * as fs from 'fs-extra';
import Globals from '../../utils/globals';

@StackRegister.register
export default class GitHub {
  async isAvailable(): Promise<boolean> {
    const exec = util.promisify(cp.exec);

    return fs
      .lstat(`${Globals.rootPath}.git`)
      .then(lstat => {
        if (!lstat.isDirectory()) {
          return false;
        }
        return exec(`git remote -v`, { cwd: Globals.rootPath })
          .then((value: { stdout: string }) => {
            return value.stdout.includes('github.com');
          })
          .catch(err => {
            logger.error('Could not execute "git" command, is git installed ?');
            logger.debug(err);
            return false;
          });
      })
      .catch(err => {
        logger.debug(err);
        return false;
      });
  }

  name() {
    return this.constructor.name;
  }
}
