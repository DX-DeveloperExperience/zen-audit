import { TypeScript } from './../stacks/typescript';
import { JavaScript } from './../stacks/javascript';
import { StackRegister } from './../stacks/stack-register';
import { FileNotReadableError } from './../errors/FileNotReadableError';
import { RuleRegister } from './rule-register';
import * as fs from 'fs';

/**
 * Looks for Prettier dependency in package.json, and add it if necessary.
 */
@RuleRegister.register
@StackRegister.registerRuleForStacks([JavaScript, TypeScript])
export class Prettier {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private packageFileExists: boolean;
  private parsedFile: any;

  constructor(rootPath?: string) {
    if (rootPath === undefined) {
      this.rootPath = './';
    } else {
      this.rootPath = rootPath;
    }

    this.packageJSON = `${this.rootPath}package.json`;

    try {
      this.parsedFile = JSON.parse(
        fs.readFileSync(this.packageJSON, { encoding: 'utf8' }),
      );
      this.packageFileExists = true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.packageFileExists = false;
      } else {
        throw new FileNotReadableError(this.packageJSON);
      }
    }
  }

  apply() {
    // TODO
  }

  shouldBeApplied() {
    return this.packageFileExists && !this.isInDevDep();
  }

  isInDevDep() {
    return this.hasDevDep() && this.parsedFile.devDependencies.prettier !== undefined;
  }

  hasDevDep() {
    return this.parsedFile.devDependencies !== undefined;
  }

  getName() {
    return 'Prettier';
  }

  getDescription() {
    return 'Prettier keeps your code well formatted. Would you like to install it ?';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  }
}
