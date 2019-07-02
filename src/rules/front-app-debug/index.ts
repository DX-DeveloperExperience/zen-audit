import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import VueJS from '../../stacks/vue-js';
import Angular from '../../stacks/angular';
import { React } from '../../stacks/react';
import { YesNo } from '../../choice';
import Globals from '../../utils/globals';
import { vscodeConfig } from './constants';
import Stack from '../../stacks/stack';

@RuleRegister.register
@StackRegister.registerRuleForStacks([VueJS, Angular, React])
export class FrontAppDebug {
  private parsedLaunchConf: object;
  //   private configurations: object[];
  private launchFileExists: boolean;

  constructor() {
    try {
      this.parsedLaunchConf = require(`${Globals.rootPath}.vscode/launch.json`);
      this.launchFileExists = true;
    } catch (err) {
      this.parsedLaunchConf = vscodeConfig;
      this.launchFileExists = false;
    }
  }

  async shouldBeApplied(): Promise<boolean> {
    return !this.launchFileExists;
  }

  async apply(apply: boolean): Promise<void> {
    // TODO
  }

  missingConfigurations(): object[] {
    return [{}];
  }

  getName(): string {
    return 'Front Application Debugging';
  }

  getShortDescription(): string {
    return 'In order to debug front-end applications made with Vue, Angular or React, this rule adds the config file in .vscode folder.';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
