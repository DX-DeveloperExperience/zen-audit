import { StackRegister } from '../stack-register';

@StackRegister.register
export class JavaScript {
  isAvailable(path: string) {
    try {
      return require(`${path}/package.json`);
    } catch (e) {
      return false;
    }
  }

  name() {
    return this.constructor.name;
  }
}
