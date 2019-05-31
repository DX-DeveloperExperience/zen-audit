import { StackRegister } from '../stack-register';
import * as fs from 'fs-extra';

@StackRegister.register
export class Node {
  private packagePath: string;

  constructor(readonly rootPath: string = './') {
    this.packagePath = `${this.rootPath}package.json`;
  }

  isAvailable() {
    try {
      require(this.packagePath);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  isAvailableProm(): Promise<boolean> {
    return fs
      .readFile(this.packagePath, 'utf-8')
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
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
