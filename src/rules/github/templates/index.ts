import { RuleRegister } from '../../rule-register/index';
import { StackRegister } from '../../../stacks/stack-register';
import GitHub from '../../../stacks/github';
import * as fs from 'fs-extra';
import { YesNo } from '../../../choice/index';
import { logger } from '../../../logger/index';
import Choice from '../../../choice/index';
import Globals from '../../../utils/globals/index';

@RuleRegister.register
@StackRegister.registerRuleForStacks([GitHub])
export class GitHubTemplates {
  private readonly templatesPath: string;
  constructor() {
    this.templatesPath = Globals.rootPath + '.github/ISSUE_TEMPLATE/';
  }

  shouldBeApplied(): Promise<boolean> {
    return fs
      .pathExists(this.templatesPath)
      .then(pathExists => {
        if (!pathExists) {
          return true;
        }
        return fs
          .readdir(this.templatesPath)
          .then(fileNames => {
            return (
              fileNames.find(fileName => {
                return fileName.endsWith('.md');
              }) === undefined
            );
          })
          .catch(err => {
            logger.debug(err);
            throw new Error('Could not read .github/ISSUE_TEMPLATE directory.');
          });
      })
      .catch(err => {
        logger.debug(err);
        throw new Error(
          'Error trying to check for .github/ISSUE_TEMPLATE path existence.',
        );
      });
  }

  apply(answers: boolean): Promise<void> {
    return fs
      .ensureDir(this.templatesPath)
      .then(() => {
        fs.copy(`${__dirname}/template_files`, this.templatesPath)
          .then(() => {
            logger.info(
              'Succesully added issue templates file into .github/ISSUE_TEMPLATE directory. You may customize them to suit your needs.',
            );
          })
          .catch(err => {
            logger.debug(err);
            throw new Error('Error trying to copy template files.');
          });
      })
      .catch(err => {
        logger.debug(err);
        throw new Error(
          'Could not create or ensure existence of .github/ISSUE_TEMPLATE directory.',
        );
      });
  }

  getName(): string {
    return 'GitHub Issue Templates';
  }

  getShortDescription(): string {
    return 'Check for existing GitHub issue templates, if none is found, create one with default template';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType(): string {
    return 'list';
  }

  getChoices(): Choice[] | Promise<Choice[]> {
    return YesNo;
  }
}
