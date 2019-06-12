import { StackRegister } from '../stack-register';

@StackRegister.register
export default class Angular {
  constructor(private readonly rootPath: string = './') {}

  async isAvailable(): Promise<boolean> {
    try {
      const packageJSON = require(`${this.rootPath}package.json`);
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
