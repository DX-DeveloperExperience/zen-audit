import * as util from 'util';
import * as cp from 'child_process';
import { logger } from '../../logger';

const exec = util.promisify(cp.exec);

export function installNpmDevDep(dependency: string) {
  return exec(`npm i ${dependency} -DE`)
    .then(() => {
      logger.info(`Succesfully installed ${dependency}.`);
      return Promise.resolve();
    })
    .catch(err => {
      logger.error(
        `Error trying to install ${dependency}, try to install it with 'npm i ${dependency} -DE' command.`,
      );
      logger.debug(err);
      return Promise.reject(err);
    });
}