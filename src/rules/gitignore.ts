import { RuleRegister } from './rule-register';
import * as fs from 'fs';

@RuleRegister.register
export class GitIgnore {
  readonly requiredFiles: string[] = ['.gitignore'];
  readonly rootPath: string;
  private gitIgnoreContent: string;
  private gitIgnorePath: string;
  private gitIgnoreExists: boolean;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.gitIgnorePath = `${this.rootPath}.gitignore`;
    try {
      this.gitIgnoreContent = fs.readFileSync(this.gitIgnorePath, {
        encoding: 'utf8',
      });

      this.gitIgnoreExists = true;
    } catch (err) {
      this.gitIgnoreContent = '';
      this.gitIgnoreExists = false;
    }
  }

  shouldBeApplied() {
    return !this.gitIgnoreExists || this.gitIgnoreContent === '';
  }

  apply() {
    // TODO
  }

  name() {
    return 'GitIgnore';
  }

  description() {
    return 'GitIgnore: this rule will add a .gitignore file containing rules corresponding to your project.';
  }
}
