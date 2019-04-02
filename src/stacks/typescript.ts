import { StackRegister } from './stack-register';

@StackRegister.register
export class TypeScript {
  isInPath() {
    return true;
  }
}
