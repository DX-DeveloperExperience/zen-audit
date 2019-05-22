import { StackRegister } from '../stack-register';
import * as fs from 'fs';

@StackRegister.register
export class Node {
  constructor(readonly rootPath: string = './') {}

  isAvailable() {
    try {
      require(`${this.rootPath}package.json`);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  parsedPackage() {
    if (this.isAvailable()) {
      return require(`${this.rootPath}package.json`);
    }
  }

  name() {
    return this.constructor.name;
  }
}
