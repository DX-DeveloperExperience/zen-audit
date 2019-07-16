import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import { YesNo } from '../../../../choice';
import { logger } from '../../../../logger/index';
import { ListStacks } from '../../../../stacks/list-stacks';
import * as fs from 'fs-extra';
import Elasticsearch from '../../../../stacks/elasticsearch';
import axios from 'axios';
import Globals from '../../../../utils/globals';
import { ReadFileError } from '../../../../errors/FileErrors';

/**
 * This Rule will look for a .gitignore file. If it doesn't exist, applying this rule will
 * add this file, and fill it with rules corresponding to your project
 * gathered from these sources: https://github.com/github/gitignore
 */
@RuleRegister.register
@StackRegister.registerRuleForAll({ excludes: [Elasticsearch] })
export class GitIgnore {
  readonly requiredFiles: string[] = ['.gitignore'];
  private gitIgnoreContent: string | undefined;
  private gitIgnorePath: string;
  private description: string = '';
  private missingRules: string[] | undefined;

  constructor() {
    this.gitIgnorePath = `${Globals.rootPath}.gitignore`;
  }

  private async gitIgnoreExists(): Promise<boolean> {
    return fs.pathExists(this.gitIgnorePath);
  }

  private async getGitIgnoreContent(): Promise<string> {
    if (this.gitIgnoreContent !== undefined) {
      return this.gitIgnoreContent;
    }

    return fs
      .readFile(this.gitIgnorePath, {
        encoding: 'utf-8',
      })
      .then((result: string) => {
        this.gitIgnoreContent = result;
        return this.gitIgnoreContent;
      })
      .catch(err => {
        throw new ReadFileError(err, this.gitIgnorePath, this.constructor.name);
      });
  }

  /**
   * Returns true if .gitignore
   */
  async shouldBeApplied(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.gitIgnoreExists()
        .then(
          result => {
            if (result === false) {
              resolve(true);
            }
            return this.getGitIgnoreContent();
          },
          err => {
            reject(err);
          },
        )
        .then(gitIgnoreContent => {
          if (gitIgnoreContent === '') {
            resolve(true);
          }
          return this.missGitRules();
        })
        .then(missGitRules => {
          resolve(missGitRules);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private getMissingGitRules(): Promise<string[]> {
    if (this.missingRules !== undefined) {
      return Promise.resolve(this.missingRules);
    }

    return ListStacks.getAvailableStacks().then(availableStacks => {
      const getKeptRules = availableStacks.map(stack => {
        const getNewRules: Promise<string[]> = axios
          .get(`https://gitignore.io/api/${stack.name().toLowerCase()}`)
          .then(result => {
            return result.data
              .split('\n')
              .map((rule: string) => rule.trim())
              .filter((rule: string) => rule !== '');
          })
          .catch(() => {
            return [];
          });

        return getNewRules.then(async newRules => {
          const gitIgnoreContent = await this.getGitIgnoreContent();
          const currRules = gitIgnoreContent
            .split('\n')
            .map((rule: string) => rule.trim());

          const filterRules = newRules.filter((newRule: string) => {
            return !currRules.includes(newRule) && !newRule.startsWith('#');
          });

          return filterRules;
        });
      });

      return Promise.all(getKeptRules).then(keptRules => {
        return keptRules.reduce((acc: string[], curr: string[]) => {
          return [...acc, ...curr];
        }, []);
      });
    });
  }

  private missGitRules(): Promise<boolean> {
    return this.getMissingGitRules().then(missingGitRules => {
      return missingGitRules.length !== 0;
    });
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return Promise.all([
        this.getMissingGitRules(),
        this.getGitIgnoreContent(),
      ]).then((result: [string[], string]) => {
        const missingRules = result[0];
        const gitIgnoreContent = result[1];
        if (missingRules !== undefined) {
          return fs
            .writeFile(
              this.gitIgnorePath,
              (gitIgnoreContent + '\n' + missingRules.join('\n')).trim(),
              { encoding: 'utf-8' },
            )
            .then(() => {
              logger.info('Succesfully added rules to .gitignore file.');
            })
            .catch(err => {
              logger.error(
                `An error occured while trying to write to your project's .gitignore file.`,
              );
              logger.debug(err);
            });
        }
      });
    }
  }

  getName() {
    return 'GitIgnore';
  }

  getShortDescription() {
    return `${
      this.description
    }This rule will add rules to your .gitignore, corresponding to found stacks. Would you like to apply it ?`;
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
