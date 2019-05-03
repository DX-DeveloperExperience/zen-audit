import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import { StackRegister } from '../../stacks/stack-register';

/**
 * This Rule will look for a .gitignore file. If it doesn't exist, applying this rule will
 * add this file, and fill it with rules corresponding to your project
 * gathered from these sources: https://github.com/github/gitignore
 */
@RuleRegister.register
@StackRegister.registerRuleForAll
export class GitIgnore {
  readonly requiredFiles: string[] = ['.gitignore'];
  readonly rootPath: string;
  private gitIgnoreContent: string = '';
  private gitIgnorePath: string;
  private gitIgnoreExists: boolean;
  private description: string = '';

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.gitIgnorePath = `${this.rootPath}.gitignore`;
    try {
      this.gitIgnoreContent = fs.readFileSync(this.gitIgnorePath, {
        encoding: 'utf8',
      });
      this.gitIgnoreExists = true;
    } catch (err) {
      this.gitIgnoreExists = false;
      this.description = 'The .gitignore file was not found.';
    }
  }

  /**
   * Returns true if .gitignore
   */
  shouldBeApplied() {
    return !this.gitIgnoreExists || this.gitIgnoreContent === '';
  }

  apply() {
    // TODO
  }

  getName() {
    return 'GitIgnore';
  }

  getDescription() {
    return `${this.description} Choose the rules you would like to apply: `;
  }

  getPromptType() {
    return 'checkbox';
  }

  getChoices() {
    return [{ name: 'Rule1', value: 1 }, { name: 'Rule2', value: 2 }];
  }
}
