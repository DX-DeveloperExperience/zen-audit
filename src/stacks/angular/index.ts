import { StackRegister } from '../stack-register';

@StackRegister.register
export class Angular {
  constructor(private readonly rootPath: string = './') {}

  isAvailable() {
    try {
      const packageJson = require(`${this.rootPath}/package.json`);
      return Object.keys(packageJson.dependencies).includes('@angular/core');
    } catch (e) {
      return false;
    }
  }

  isAvailableProm(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const packageJSON = require(`${this.rootPath}package.json`);
        resolve(
          Object.keys(packageJSON.dependencies).includes('@angular/core'),
        );
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
          resolve(false);
        }
        reject(e);
      }
    });
  }

  name() {
    return this.constructor.name;
  }
}
