import { StackRegister } from '../stack-register';
import { existsPaths } from '../../utils/file-utils/index';
import Globals from '../../utils/globals';

@StackRegister.register
export default class Node {
  async isAvailable(): Promise<boolean> {
    try {
      require(Globals.packageJSONPath);
      return true;
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        return false;
      }
      err.message = `Node Stack: Error reading file ${Globals.packageJSONPath}`;
      throw err;
    }
  }

  name() {
    return this.constructor.name;
  }
}
