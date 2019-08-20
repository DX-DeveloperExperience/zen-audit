import { existsPaths } from '../../utils/file-utils';
import Globals from '../../utils/globals';
import { Register } from '../../register';

@Register.stack
export default class Java {
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
