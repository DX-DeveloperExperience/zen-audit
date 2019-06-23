import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/file-utils';
import Globals from '../../utils/globals';

@StackRegister.register
export default class Java {
  constructor() {}

  isAvailable() {
    return existsPaths(
      `${Globals.rootPath}pom.xml`,
      `${Globals.rootPath}build.gradle`,
    );
  }

  name() {
    return this.constructor.name;
  }
}
