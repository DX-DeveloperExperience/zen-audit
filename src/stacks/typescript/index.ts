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
      if (err.code === 'MODULE_NOT_FOUND') {
        this.hasDevDependency = false;
        return;
      }
      err.message = `TypeScript Stack: Error while requiring ${
        Globals.packageJSONPath
      }.`;
      throw err;
    }
  }

  async isAvailable() {
    return this.hasDevDependency;
  }

  name() {
    return this.constructor.name;
  }
}
