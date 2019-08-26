import { YesNo } from './../../../../choice/index';
import { WriteFileError } from '../../../../errors/file-errors';
import Elasticsearch from '../../../../stacks/elasticsearch';
import { Website } from '../../../../stacks/website';
import { ensureDir } from 'fs-extra';
import Globals from '../../../../utils/globals';
import { logger } from '../../../../logger';
import Choice from '../../../../choice';
import { DirError } from '../../../../errors/dir-errors';
import { copy } from '../../../../utils/file-utils';
import { Register } from '../../../../register';

@Register.ruleForAll({ excludes: [Elasticsearch, Website] })
export default class CiScripts {
  private scriptsPath = Globals.rootPath + 'ci-scripts';
  private defaultScriptsPath = __dirname + '/scripts';

  async shouldBeApplied(): Promise<boolean> {
    return true;
  }

  async apply(): Promise<void> {
    return new Promise((resolve, reject) => {
      return ensureDir(this.scriptsPath)
        .then(
          () => {
            return copy(this.defaultScriptsPath, this.scriptsPath);
          },
          err => {
            reject(new DirError(err, this.scriptsPath, this.getName()));
          },
        )
        .then(
          () => {
            logger.info(
              `${this.getName()}: Succesfully added CI scripts to ci-scripts folder. Please take some time to update them to fit your project and place them in your CI's folder. Then just run 'run_all.sh' in your CI.`,
            );
            resolve();
          },
          err => {
            if (err instanceof WriteFileError) {
              reject(err);
            }
            resolve();
          },
        );
    });
  }
  getName(): string {
    return 'CI Scripts';
  }
  getShortDescription(): string {
    return `${this.getName()}: This rule will add bash scripts to a ci-scripts folder at the root of your project.\
    These scripts' purpose is to be run in your CI. Continue ?`;
  }
  getLongDescription(): string {
    return 'Long Description';
  }
  getPromptType(): string {
    return 'list';
  }
  getChoices(): Choice[] {
    return YesNo;
  }
}
