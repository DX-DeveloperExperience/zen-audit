import { Register } from './../../../../register/index';
import { logger } from '../../../../logger/index';
import TypeScript from '../../../../stacks/typescript';
import Node from '../../../../stacks/node';
import { hasDevDependency } from '../../../../utils/json/index';
import Globals from '../../../../utils/globals';
import { execInRootpath } from '../../../../utils/commands';
/**
 * Looks for Prettier dependency in package.json, and add it if necessary.
 */
@Register.ruleForStacks([Node, TypeScript])
export class Prettier {
  private packagePath: string;
  private parsedPackage: any;

  constructor() {
    this.packagePath = `${Globals.rootPath}package.json`;
    this.parsedPackage = require(this.packagePath);
  }

  async apply() {
    return execInRootpath('npm i prettier -DE').then(
      (result: { stdout: string; stderr: string }) => {
        logger.debug(result.stderr);
        logger.info('Succesfully installed prettier.');
      },
    );
  }

  async shouldBeApplied() {
    return !hasDevDependency(this.parsedPackage, 'prettier');
  }

  getName() {
    return 'Prettier';
  }

  getShortDescription() {
    return 'Prettier keeps your code well formatted. Would you like to install it ?';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return [{ name: 'Yes', value: true }, { name: 'No', value: false }];
  }
}
