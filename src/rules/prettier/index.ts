import { TypeScript } from '../../stacks/typescript';
import { Node } from '../../stacks/node';
import { StackRegister } from '../../stacks/stack-register';
import { RuleRegister } from '../rule-register';
import * as util from 'util';
import * as cp from 'child_process';
/**
 * Looks for Prettier dependency in package.json, and add it if necessary.
 */
@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class Prettier {
  private packagePath: string;
  private parsedPackage: any;

  constructor(private readonly rootPath: string = './') {
    this.packagePath = `${rootPath}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  async apply(apply: boolean) {
    if (apply) {
      const exec = util.promisify(cp.exec);

      exec('npm i prettier -DE', { cwd: this.rootPath })
        .then((result: { stdout: string; stderr: string }) => {
          console.log(result.stderr);
          return 'Succesfully installed prettier.';
        })
        .catch(() => {
          throw new Error(
            'Could not install prettier, try installing it using "npm i prettier -DE" command in your terminal.',
          );
        });
    }
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
