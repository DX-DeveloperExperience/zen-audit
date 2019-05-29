import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/fs';

@StackRegister.register
export class Java {
  constructor(readonly rootPath: string = './') {}

  isAvailable() {
    return existsPaths(
      `${this.rootPath}pom.xml`,
      `${this.rootPath}build.gradle`,
    );
  }

  name() {
    return this.constructor.name;
  }
}
