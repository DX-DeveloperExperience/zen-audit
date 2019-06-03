import { StackRegister } from '../stack-register';

@StackRegister.register
export class Angular {
  constructor(private readonly rootPath: string = './') {}

  // isAvailable() {
  //   try {
  //     const packageJson = require(`${this.rootPath}/package.json`);
  //     return Object.keys(packageJson.dependencies).includes('@angular/core');
  //   } catch (e) {
  //     return false;
  //   }
  // }

  async isAvailable(): Promise<boolean> {
    try {
      const packageJSON = require(`${this.rootPath}package.json`);
      return Object.keys(packageJSON.dependencies).includes('@angular/core');
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
