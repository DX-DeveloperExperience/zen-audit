import { StackRegister } from '../stack-register';
import Globals from '../../utils/globals';

@StackRegister.register
export default class VueJS {
  constructor() {}

  async isAvailable(): Promise<boolean> {
    try {
      const packageJson = require(`${Globals.rootPath}/package.json`);
      if (packageJson.dependencies !== undefined) {
        return Object.keys(packageJson.dependencies).includes('vue');
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
