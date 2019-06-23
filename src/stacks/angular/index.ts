import { StackRegister } from '../stack-register';
import Globals from '../../utils/globals';

@StackRegister.register
export default class Angular {
  constructor() {}

  async isAvailable(): Promise<boolean> {
    try {
      const packageJSON = require(`${Globals.rootPath}package.json`);
      if (packageJSON.dependencies !== undefined) {
        return Object.keys(packageJSON.dependencies).includes('@angular/core');
      }
      return false;
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        return false;
      }
      throw e;
    }
  }

  name() {
    return this.constructor.name;
  }
}
