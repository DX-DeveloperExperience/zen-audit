import { TypeScript } from '../../stacks/typescript';
import { Node } from '../../stacks/node';
import { StackRegister } from '../../stacks/stack-register';
import { FileNotReadableError } from '../../errors/FileNotReadableError';
import { RuleRegister } from '../rule-register';
import * as fs from 'fs';

/**
 * Looks for Prettier dependency in package.json, and add it if necessary.
 */
@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Prettier {
  private packagePath: string;
  private parsedPackage: any;

  constructor(private readonly path: string = './') {
    this.packagePath = `${path}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  async apply() {
    // TODO
  }

  async shouldBeApplied() {
    return !this.isInDevDep();
  }

  isInDevDep() {
    return (
      this.hasDevDep() &&
      this.parsedPackage.devDependencies.prettier !== undefined
    );
  }

  hasDevDep() {
    return this.parsedPackage.devDependencies !== undefined;
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
