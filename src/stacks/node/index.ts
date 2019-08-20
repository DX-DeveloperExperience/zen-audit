import Globals from '../../utils/globals';
import { ReadFileError } from '../../errors/FileErrors';
import { Register } from '../../register';

@Register.stack
export default class Node {
  async isAvailable(): Promise<boolean> {
    try {
      require(Globals.packageJSONPath);
      return true;
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        return false;
      }
      throw new ReadFileError(
        err,
        Globals.packageJSONPath,
        this.constructor.name,
      );
    }
  }

  name() {
    return this.constructor.name;
  }
}
