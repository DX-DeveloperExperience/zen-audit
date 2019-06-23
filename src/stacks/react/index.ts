import { StackRegister } from '../stack-register';
import { hasDependency } from '../../utils/json/index';

@StackRegister.register
export class React {
  constructor(private readonly rootPath: string) {}
  async isAvailable(): Promise<boolean> {
    return hasDependency(this.rootPath, 'react');
  }

  name(): string {
    return 'React';
  }
}
