import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/file-utils/index';
import Globals from '../../utils/globals';
import { logger } from '../../logger/index';

@StackRegister.register
export default class Node {
  private packagePath: string;
  private packageJSON: Object = {};
  private packageExists: boolean = false;

  constructor() {
    this.packagePath = `${Globals.rootPath}package.json`;

    try {
      this.packageJSON = require(this.packagePath);
      this.packageExists = true;
    } catch (err) {
      logger.info(`Node Stack: Error while parsing ${this.packagePath}`);
      logger.debug(err);
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.packageExists;
  }

  name() {
    return this.constructor.name;
  }
}
