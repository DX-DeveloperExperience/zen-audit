import { YesNo } from './../../../../../choice/index';
import { StackRegister } from '../../../../../stacks/stack-register';
import Rule from '../../../../rule';
import Angular from '../../../../../stacks/angular';
import { React } from '../../../../../stacks/react';
import VueJS from '../../../../../stacks/vue-js';
import Globals from '../../../../../utils/globals';
import { pathExists, copy } from 'fs-extra';
import Choice from '../../../../../choice';

@StackRegister.registerRuleForStacks([Angular, React, VueJS])
export default class Dockerfile implements Rule {
  private dockerFilePath = Globals.rootPath + 'Dockerfile';

  async shouldBeApplied(): Promise<boolean> {
    return await !pathExists(this.dockerFilePath);
  }
  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return copy(__dirname + 'Dockerfile', this.dockerFilePath);
    }
  }
  getName(): string {
    return 'Dockerfile';
  }
  getShortDescription(): string {
    return 'Would you like to add a Dockerfile to your project ?';
  }
  getLongDescription(): string {
    return 'blablababla';
  }
  getPromptType(): string {
    return 'list';
  }
  getChoices(): Choice[] {
    return YesNo;
  }
}
