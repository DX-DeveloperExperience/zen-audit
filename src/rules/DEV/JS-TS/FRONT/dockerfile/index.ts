import { Register } from './../../../../../register/index';
import { WriteFileError } from '../../../../../errors/file-errors';
import { YesNo } from './../../../../../choice/index';
import Globals from '../../../../../utils/globals';
import Choice from '../../../../../choice';
import Nginx from '../nginx';
import { copy } from '../../../../../utils/file-utils';
import { logger } from '../../../../../logger';

@Register.subRuleOf(Nginx)
export default class Dockerfile {
  private dockerFilePath = Globals.rootPath + 'Dockerfile';
  private defaultDockerFilePath = __dirname + '/Dockerfile';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(): Promise<void> {
    return copy(this.defaultDockerFilePath, this.dockerFilePath).then(
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
