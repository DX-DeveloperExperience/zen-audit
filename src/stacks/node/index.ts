import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/file-utils/index';
import Globals from '../../utils/globals';

@StackRegister.register
export default class Node {
  private packagePath: string;

  constructor() {
    this.packagePath = `${Globals.rootPath}package.json`;
  }

  isAvailable(): Promise<boolean> {
    return existsPaths(this.packagePath);
  }

  parsedPackage(): object {
    if (this.isAvailable()) {
      return require(this.packagePath);
    }

    return {};
  }

  name() {
    return this.constructor.name;
  }
}
