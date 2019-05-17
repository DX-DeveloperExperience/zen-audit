import { RuleRegister } from '../rule-register';
import * as fs from 'fs';
import { StackRegister } from '../../stacks/stack-register';
import Choice, { YesNo } from '../../choice';
import { ListStacks } from '../../stacks/list-stacks';
import request from 'sync-request';
import { Elasticsearch } from '../../stacks/elasticsearch';

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
  private gitIgnoreExists: boolean;
  private description: string = '';
  private missingRules: string = '';

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.gitIgnorePath = `${this.rootPath}.gitignore`;
    try {
      this.gitIgnoreContent = fs
        .readFileSync(this.gitIgnorePath, {
          encoding: 'utf8',
        })
        .trim();
      this.gitIgnoreExists = true;
    } catch (err) {
      this.gitIgnoreExists = false;
      this.description = 'The .gitignore file was not found. ';
    }
  }

  /**
   * Returns true if .gitignore
   */
  shouldBeApplied() {
    return (
      !this.rootPath.startsWith('http') &&
      (!this.gitIgnoreExists ||
        this.gitIgnoreContent === '' ||
        this.missGitRules())
    );
  }

  private missGitRules() {
    this.missingRules = ListStacks.getStacksIn(this.rootPath).reduce(
      (keptRules, currStack) => {
        const stackName = currStack.name().toLowerCase();

        let newRules = '';
        try {
          newRules = request('GET', `https://gitignore.io/api/${stackName}`, {
            timeout: 5000,
          })
            .getBody()
            .toString();
        } catch (err) {}

        let addedRules: string = '';
        newRules.split('\n').forEach((newRule: string) => {
          let addRule: boolean = true;

          // if a line from the gitignore api starts with a #, ignore it and go to next line
          if (newRule.trim().startsWith('#')) {
            return;
          }

          this.gitIgnoreContent.split('\n').forEach(currRule => {
            if (newRule.trim() === currRule.trim()) {
              addRule = false;
            }
          });
          addedRules += addRule ? newRule + '\n' : '';
        });
        return keptRules + addedRules;
      },
      '',
    );
    return this.missingRules !== '';
  }

  apply() {
    fs.writeFileSync(
      this.gitIgnorePath,
      this.gitIgnoreContent + '\n' + this.missingRules.trim(),
      { encoding: 'utf8' },
    );
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
