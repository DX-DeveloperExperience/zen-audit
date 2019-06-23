import { StackRegister } from '../stack-register';
import { logger } from '../../logger/index';
import Globals from '../../utils/globals';

@StackRegister.register
export default class TypeScript {
  constructor() {}

  async isAvailable() {
    try {
      const packageJSON = require(`${Globals.rootPath}package.json`);
      if (packageJSON.devDependencies !== undefined) {
        return Object.keys(packageJSON.devDependencies).includes('typescript');
      }
      return false;
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        return false;
      }
      logger.error(
        `TypeScript Stack: Error trying to read ${
          Globals.rootPath
        }package.json, run in debug mode to find why.`,
      );
      logger.debug(e);
      return false;
    }
  }

  name() {
    return this.constructor.name;
  }
}
