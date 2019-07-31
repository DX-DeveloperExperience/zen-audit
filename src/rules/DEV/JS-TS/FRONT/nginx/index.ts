import { YesNo } from './../../../../../choice/index';
import { WriteFileError } from './../../../../../errors/FileErrors';
import { DirError } from './../../../../../errors/DirErrors';
import { RuleRegister } from '../../../../rule-register';
import { StackRegister } from '../../../../../stacks/stack-register';
import Angular from '../../../../../stacks/angular';
import { React } from '../../../../../stacks/react';
import VueJS from '../../../../../stacks/vue-js';
import { ensureDir, copy } from 'fs-extra';
import Globals from '../../../../../utils/globals';
import { logger } from '../../../../../logger';
import Choice from '../../../../../choice';
import { myCopy } from '../../../../../utils/file-utils';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Angular, React, VueJS])
export default class Nginx {
  private configDirPath = Globals.rootPath + 'config';
  private configFilePath = this.configDirPath + '/nginx.conf';
  private defaultConfFilePath = __dirname + '/nginx.conf';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return ensureDir(this.configDirPath)
        .then(
          () => {
            return myCopy(this.defaultConfFilePath, this.configFilePath);
          },
          err => {
            throw new DirError(err, this.configDirPath, this.getName());
          },
        )
        .then(
          () => {
            logger.info('Succesfully copied nginx.conf file to config folder.');
          },
          err => {
            if (err instanceof WriteFileError) {
              throw err;
            }
          },
        );
    }
  }

  getName(): string {
    return 'Nginx';
  }
  getShortDescription(): string {
    return 'Would you like to add a configuration file for Nginx ?';
  }
  getLongDescription(): string {
    throw new Error('Method not implemented.');
  }
  getPromptType(): string {
    return 'list';
  }
  getChoices(): Choice[] {
    return YesNo;
  }
}
