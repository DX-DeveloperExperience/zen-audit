import { StackRegister } from '../stack-register';
import { existsPaths } from '../../file-utils/index';

@StackRegister.register
export class Node {
  private packagePath: string;

  constructor(readonly rootPath: string = './') {
    this.packagePath = `${this.rootPath}package.json`;
  }

  isAvailable(): Promise<boolean> {
    return new Promise((resolve, reject) =>
      setTimeout(
        () => resolve(existsPaths(`${this.rootPath}package.json`)),
        5000,
      ),
    );
  }

  parsedPackage(): object {
    if (this.isAvailable()) {
      return require(`${this.rootPath}package.json`);
    }

    return {};
  }

  name() {
    return this.constructor.name;
  }
}
