import { StackRegister } from '../stack-register';
import { hasDependency } from '../../utils/json/index';
import Globals from '../../utils/globals';

@StackRegister.register
export class React {
  constructor() {}
  async isAvailable(): Promise<boolean> {
    return hasDependency(Globals.rootPath, 'react');
  }

  name(): string {
    return 'React';
  }
}
