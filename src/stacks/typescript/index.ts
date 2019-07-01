import { StackRegister } from '../stack-register';
import { logger } from '../../logger/index';
import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json';

@StackRegister.register
export default class TypeScript {
  private parsedPackage: object = {};
  private hasDevDependency: boolean = false;

  constructor() {
    try {
      this.parsedPackage = require(Globals.packageJSONPath);
      this.hasDevDependency = pathExistsInJSON(this.parsedPackage, [
        'devDependencies',
        'typescript',
      ]);
    } catch (err) {
      logger.error(
        `TypeScript Stack: Error while reading/parsing ${
          Globals.packageJSONPath
        }.`,
      );
      logger.debug(err);
    }
  }

  async isAvailable() {
    return this.hasDevDependency;
  }

  name() {
    return this.constructor.name;
  }
}
