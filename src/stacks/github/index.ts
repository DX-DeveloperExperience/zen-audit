import { StackRegister } from '../stack-register';
import * as util from 'util';
import * as cp from 'child_process';

@StackRegister.register
export class GitHub {
  constructor(readonly rootPath: string = './') {}

  async isAvailable(): Promise<boolean> {
    const exec = util.promisify(cp.exec);

    return exec(`git -C ${this.rootPath} remote -v`)
      .then((value: { stdout: string; stderr: string }) => {
        return value.stdout.includes('github.com');
      })
      .catch(() => {
        throw new Error('Could not execute "git" command, is git installed ?');
      });
  }

  name() {
    return this.constructor.name;
  }
}
