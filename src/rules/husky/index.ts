import { FileNotReadableError } from '../../errors/FileNotReadableError';
import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import { Node } from '../../stacks/node';
import { TypeScript } from '../../stacks/typescript';
import { StackRegister } from '../../stacks/stack-register';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Husky {
  readonly requiredFiles: string[] = ['package.json'];
  readonly rootPath: string;
  private packageJSON: string;
  private packageFileExists: boolean;
  private parsedFile: any;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;

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

  isInDevDep(): boolean {
    return (
      this.hasDevDep() && this.parsedFile.devDependencies.husky !== undefined
    );
  }

  hasDevDep(): boolean {
    return this.parsedFile.devDependencies !== undefined;
  }

  getName(): string {
    return 'Husky';
  }

  getDescription(): string {
    return 'Husky can prevent bad commits or bad push. Please select rules you would like to add.';
  }

  getPromptType() {
    return 'checkbox';
  }

  getChoices() {
    return [{ name: 'Rule1', value: 1 }, { name: 'Rule2', value: 2 }];
  }
}
