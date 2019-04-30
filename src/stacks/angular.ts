import { StackRegister } from './stack-register';

@StackRegister.register
export class Angular {
  isInPath() {
    return true;
  }
}
