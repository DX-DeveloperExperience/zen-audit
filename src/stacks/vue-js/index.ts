import { StackRegister } from '../stack-register';

@StackRegister.register
export class VueJS {
  constructor(private readonly rootPath: string = './') {}

  async isAvailable(): Promise<boolean> {
    try {
      const packageJson = require(`${this.rootPath}/package.json`);
      return Object.keys(packageJson.dependencies).includes('vue');
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
