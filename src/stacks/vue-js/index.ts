import { StackRegister } from '../stack-register';

@StackRegister.register
export class VueJS {
  isAvailable(path: string) {
    try {
      const packageJson = require(`${path}/package.json`);
      return Object.keys(packageJson.dependencies).includes('vue');
    } catch (e) {
      return false;
    }
  }

  name() {
    return this.constructor.name;
  }
}
