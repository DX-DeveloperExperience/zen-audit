import { WriteFileError } from './../../../../../errors/FileErrors';
import { YesNo } from './../../../../../choice/index';
import { StackRegister } from '../../../../../stacks/stack-register';
import Angular from '../../../../../stacks/angular';
import { React } from '../../../../../stacks/react';
import VueJS from '../../../../../stacks/vue-js';
import Globals from '../../../../../utils/globals';
import { pathExists, copy } from 'fs-extra';
import Choice from '../../../../../choice';
import { RuleRegister } from '../../../../rule-register';
import Nginx from '../nginx';
import { myCopy } from '../../../../../utils/file-utils';

@StackRegister.registerRuleForStacks([Angular, React, VueJS])
@RuleRegister.registerSubRuleOf(Nginx)
export default class Dockerfile {
  private dockerFilePath = Globals.rootPath + 'Dockerfile';
  private defaultDockerFilePath = __dirname + '/Dockerfile';

  async shouldBeApplied(): Promise<boolean> {
    return await !pathExists(this.dockerFilePath);
  }
  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return myCopy(this.defaultDockerFilePath, this.dockerFilePath).catch(
        err => {
          if (err instanceof WriteFileError) {
            throw err;
          }
        },
      );
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
