import { StackRegister } from '../stack-register';

@StackRegister.register
export class TypeScript {
  isAvailable(path: string) {
    try {
      const packageJson = require(`${path}/package.json`);
      return Object.keys(packageJson.devDependencies).includes('typescript');
    } catch (e) {
      return false;
    }
  }

  name() {
    return this.constructor.name;
  }
}
