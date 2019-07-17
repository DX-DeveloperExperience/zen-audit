import { StackRegister } from '../stack-register';
import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json';
import { ReadFileError } from '../../errors/FileErrors';

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
      throw new ReadFileError(
        err,
        Globals.packageJSONPath,
        this.constructor.name,
      );
    }
  }

  async isAvailable() {
    return this.hasDevDependency;
  }

  name() {
    return this.constructor.name;
  }
}
