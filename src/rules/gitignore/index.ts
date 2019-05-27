import { RuleRegister } from '../rule-register';
import * as fs from 'fs-extra';
import { StackRegister } from '../../stacks/stack-register';
import { YesNo } from '../../choice';
import { ListStacks } from '../../stacks/list-stacks';
import axios from 'axios';
import { Elasticsearch } from '../../stacks/elasticsearch';
import * as util from 'util';

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
        .catch(e => {
          if (
            e.code === 'EACCESS' ||
            e.code === 'EISDIR' ||
            e.code === 'ENOENT'
          ) {
            this.gitIgnoreExists = false;
            return '';
          } else {
            throw e;
          }
        })
        .then((result: string) => {
          this.gitIgnoreContent = result.trim();
          this.gitIgnoreExists = true;

          return this.getMissingGitRules();
        })
        .then(missingGitRules => {
          console.log(missingGitRules);
          this.missingRules = missingGitRules;
          this.initialized = true;
        })
        .catch(e => {});
    }

    return Promise.resolve();
  }

  /**
   * Returns true if .gitignore
   */
  async shouldBeApplied(): Promise<boolean> {
    return this.init().then(async () => {
      return (
        !this.rootPath.startsWith('http') &&
        (!this.gitIgnoreExists ||
          this.gitIgnoreContent === '' ||
          (await this.missGitRules()))
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
            return result.data.split('\n').map((rule: string) => rule.trim());
          })
          .catch(() => {
            return [];
          });

        return getNewRules.then(newRules => {
          const currRules = this.gitIgnoreContent
            .split('\n')
            .map((rule: string) => rule.trim());

          return newRules.filter((newRule: string) => {
            return (
              !currRules.includes(newRule.trim()) && !newRule.startsWith('#')
            );
          });
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
    return this.getMissingGitRules().then(gitRules => {
      this.missingRules = gitRules;
      return gitRules.length !== 0;
    });
  }

  async apply(): Promise<void> {
    return this.init().then(() => {
      if (this.missingRules !== undefined) {
        console.log(this.missingRules);
        return fs.writeFile(
          this.gitIgnorePath,
          (this.gitIgnoreContent + '\n' + this.missingRules.join('\n')).trim(),
          { encoding: 'utf-8' },
        );
      }
    });
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
