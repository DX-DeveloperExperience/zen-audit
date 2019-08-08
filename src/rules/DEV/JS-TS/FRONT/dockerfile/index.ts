import { WriteFileError } from './../../../../../errors/FileErrors';
import { YesNo } from './../../../../../choice/index';
import Globals from '../../../../../utils/globals';
import Choice from '../../../../../choice';
import { RuleRegister } from '../../../../rule-register';
import Nginx from '../nginx';
import { myCopy } from '../../../../../utils/file-utils';
import { logger } from '../../../../../logger';

@RuleRegister.registerSubRuleOf(Nginx)
export default class Dockerfile {
  private dockerFilePath = Globals.rootPath + 'Dockerfile';
  private defaultDockerFilePath = __dirname + '/Dockerfile';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return myCopy(this.defaultDockerFilePath, this.dockerFilePath).then(
        () => {
          logger.info(`${this.getName()}: Succesfully copied Dockerfile`);
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
