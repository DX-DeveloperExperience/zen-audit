import { StackRegister } from '../stack-register';

@StackRegister.register
export class JavaScript {
  isInPath(path: string) {
    return false;
  }
}
