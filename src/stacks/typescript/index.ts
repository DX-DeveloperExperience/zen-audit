import { StackRegister } from '../stack-register';

@StackRegister.register
export default class TypeScript {
  constructor(private readonly rootPath: string = './') {}

  async isAvailable() {
    try {
      const packageJSON = require(`${this.rootPath}package.json`);
      if (packageJSON.devDependencies !== undefined) {
        return Object.keys(packageJSON.devDependencies).includes('typescript');
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
