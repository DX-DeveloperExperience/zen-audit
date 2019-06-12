import { StackRegister } from '../stack-register';
import { logger } from '../../logger/index';

@StackRegister.register
export default class TypeScript {
  constructor(private readonly rootPath: string = './') {}

  async isAvailable() {
    try {
      const packageJSON = require(`${this.rootPath}package.json`);
      if (packageJSON.devDependencies !== undefined) {
        return Object.keys(packageJSON.devDependencies).includes('typescript');
      }
      return false;
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        return false;
      }
      logger.error(
        `Error trying to read ${
          this.rootPath
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
