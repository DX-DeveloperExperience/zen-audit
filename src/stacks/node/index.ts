import { StackRegister } from '../stack-register';

@StackRegister.register
export class Node {
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
