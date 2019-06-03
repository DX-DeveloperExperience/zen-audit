import { StackRegister } from '../stack-register';

@StackRegister.register
export default class All {
  async isAvailable(): Promise<boolean> {
    return true;
  }

  name() {
    return this.constructor.name;
  }
}
