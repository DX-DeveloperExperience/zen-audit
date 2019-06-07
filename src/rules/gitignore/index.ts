import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { YesNo } from '../../choice';
import { logger } from '../../logger/index';
import { ListStacks } from '../../stacks/list-stacks';
import * as fs from 'fs-extra';
import Elasticsearch from '../../stacks/elasticsearch';
import axios from 'axios';

/**
 * This Rule will look for a .gitignore file. If it doesn't exist, applying this rule will
 * add this file, and fill it with rules corresponding to your project
 * gathered from these sources: https://github.com/github/gitignore
 */
@RuleRegister.register
@StackRegister.registerRuleForAll({ excludes: [Elasticsearch] })
export class GitIgnore {
  readonly requiredFiles: string[] = ['.gitignore'];
  readonly rootPath: string;
  private gitIgnoreContent: string = '';
  private gitIgnorePath: string;
  private gitIgnoreExists: boolean = false;
  private description: string = '';
  private missingRules: string[] | undefined = undefined;
  private initialized: boolean = false;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.gitIgnorePath = `${this.rootPath}.gitignore`;
  }

  private async init() {
    if (!this.initialized) {
      return fs
        .readFile(this.gitIgnorePath, {
          encoding: 'utf-8',
        })
        .then((result: string) => {
          this.gitIgnoreContent = result;
          this.gitIgnoreExists = true;
        })
        .catch(e => {
          if (
            e.code === 'EACCESS' ||
            e.code === 'EISDIR' ||
            e.code === 'ENOENT'
          ) {
            this.gitIgnoreExists = false;
          } else {
            throw e;
          }
        });
    }
  }

  /**
   * Returns true if .gitignore
   */
  async shouldBeApplied(): Promise<boolean> {
    return this.init().then(async () => {
      const missGitRules = await this.missGitRules();
      return (
        !this.gitIgnoreExists || this.gitIgnoreContent === '' || missGitRules
      );
    });
  }

  private getMissingGitRules(): Promise<string[]> {
    if (this.missingRules !== undefined) {
      Promise.resolve(this.missingRules);
    }

    return ListStacks.getStacksIn(this.rootPath).then(availableStacks => {
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

        return getNewRules.then(newRules => {
          const currRules = this.gitIgnoreContent
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
      this.missingRules = missingGitRules;
      return missingGitRules.length !== 0;
    });
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return this.init().then(() => {
        if (this.missingRules !== undefined) {
          return fs
            .writeFile(
              this.gitIgnorePath,
              (
                this.gitIgnoreContent +
                '\n' +
                this.missingRules.join('\n')
              ).trim(),
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

  getDescription() {
    return `${
      this.description
    }This rule will add rules to your .gitignore, corresponding to found stacks. Would you like to apply it ?`;
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
