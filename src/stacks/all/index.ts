import { StackRegister } from '../stack-register';

@StackRegister.register
export default class All {
  isAvailable() {
    return true;
  }

  isAvailableProm(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      resolve(true);
    });
  }

  name() {
    return this.constructor.name;
  }
}
