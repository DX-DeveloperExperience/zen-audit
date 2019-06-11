import { StackRegister } from '../../stacks/stack-register';
import { logger } from '../../logger/index';
import { RuleRegister } from '../rule-register';
import * as util from 'util';
import * as cp from 'child_process';
import TypeScript from '../../stacks/typescript';
import Node from '../../stacks/node';
import { hasDevDependencies } from '../rules-utils/index';
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
          logger.debug(result.stderr);
          logger.info('Succesfully installed prettier.');
        })
        .catch(err => {
          logger.error(
            'Could not install prettier, try installing it using "npm i prettier -DE" command in your terminal.',
          );
          logger.debug(err);
        });
    }
  }

  async shouldBeApplied() {
    return !this.isInDevDep();
  }

  isInDevDep() {
    return (
      hasDevDependencies(this.parsedPackage) &&
      this.parsedPackage.devDependencies.prettier !== undefined
    );
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
