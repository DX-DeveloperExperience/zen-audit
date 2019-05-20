import { StackRegister } from '../stack-register';

@StackRegister.register
export default class All {
  isAvailable() {
    return true;
  }

  name() {
    return this.constructor.name;
  }
}
