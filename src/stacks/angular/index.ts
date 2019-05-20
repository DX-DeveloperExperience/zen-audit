import { StackRegister } from '../stack-register';

@StackRegister.register
export class Angular {
  isAvailable(path: string) {
    try {
      const packageJson = require(`${path}/package.json`);
      return Object.keys(packageJson.dependencies).includes('@angular/core');
    } catch (e) {
      return false;
    }
  }
  name() {
    return this.constructor.name;
  }
}
