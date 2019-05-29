import { StackRegister } from '../stack-register';
import * as fs from 'fs-extra';
import { existsPaths } from '../../utils/fs';

@StackRegister.register
export class Node {
  private packagePath: string;

  constructor(readonly rootPath: string = './') {
    this.packagePath = `${this.rootPath}package.json`;
  }

  isAvailable(): Promise<boolean> {
    return existsPaths(`${this.rootPath}package.json`);
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
