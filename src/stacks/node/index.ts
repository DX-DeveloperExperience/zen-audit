import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/file-utils/index';
import Globals from '../../utils/globals';

@StackRegister.register
export default class Node {
  isAvailable(): Promise<boolean> {
    return existsPaths(Globals.packageJSONPath);
  }

  name() {
    return this.constructor.name;
  }
}
