import { StackRegister } from '../stack-register';
import * as util from 'util';
import * as cp from 'child_process';
import { logger } from '../../logger/index';

@StackRegister.register
export class GitHub {
  constructor(readonly rootPath: string = './') {}

  async isAvailable(): Promise<boolean> {
    const exec = util.promisify(cp.exec);

    return exec(`git remote -v`, { cwd: this.rootPath })
      .then((value: { stdout: string; stderr: string }) => {
        return value.stdout.includes('github.com');
      })
      .catch(() => {
        logger.error('Could not execute "git" command, is git installed ?');
        return false;
      });
  }

  name() {
    return this.constructor.name;
  }
}
