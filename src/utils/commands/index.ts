import * as util from 'util';
import * as cp from 'child_process';
import { logger } from '../../logger';
import Globals from '../globals';

export async function installNpmDevDep(dependency: string) {
  return execInRootpath(`npm i ${dependency} -DE`)
    .then(() => {
      logger.info(`Succesfully installed ${dependency}.`);
      return;
    })
    .catch(err => {
      err.message = `Error trying to install ${dependency}, try to install it with 'npm i ${dependency} -DE' command.`;
      throw err;
    });
}

export function execInRootpath(cmd: string) {
  const exec = util.promisify(cp.exec);

  return exec(cmd, { cwd: Globals.rootPath });
}
