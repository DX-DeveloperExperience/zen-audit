import { WriteFileError } from './../../../../../errors/FileErrors';
import { DirError } from './../../../../../errors/DirErrors';
import { RuleRegister } from '../../../../rule-register/index';
import { StackRegister } from '../../../../../stacks/stack-register';
import GitHub from '../../../../../stacks/github';
import * as fs from 'fs-extra';
import { YesNo } from '../../../../../choice/index';
import { logger } from '../../../../../logger/index';
import Choice from '../../../../../choice/index';
import Globals from '../../../../../utils/globals/index';
import { bugReport, custom, featureRequest } from './constants';

@RuleRegister.register
@StackRegister.registerRuleForStacks([GitHub])
export class GitHubTemplates {
  private readonly templatesPath: string;
  constructor() {
    this.templatesPath = Globals.rootPath + '.github/ISSUE_TEMPLATE/';
  }

  shouldBeApplied(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.hasNoMarkdownFile(this.templatesPath)
        .then(
          result => {
            if (result === false) {
              resolve(false);
            }
            return fs.pathExists(
              `${Globals.rootPath}.github/ISSUE_TEMPLATE.md`,
            );
          },
          err => {
            reject(err);
          },
        )
        .then(
          (result: boolean) => {
            resolve(!result);
          },
          err => {
            reject(err);
          },
        );
    });
  }

  private async hasNoMarkdownFile(folderPath: string) {
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
        if (err.code === 'ENOTDIR' || err.code === 'ENOENT') {
          return true;
        }
        throw new DirError(err, this.templatesPath, this.constructor.name);
      });
  }

  async apply(apply: boolean): Promise<void> {
    if (apply) {
      return new Promise((resolve, reject) => {
        fs.ensureDir(this.templatesPath)
          .then(
            () => {
              const createBugReport = fs.writeFile(
                `${this.templatesPath}bug_report.md`,
                bugReport,
                { encoding: 'utf-8' },
              );
              const createCustom = fs.writeFile(
                `${this.templatesPath}custom.md`,
                custom,
                { encoding: 'utf-8' },
              );
              const createFeatReq = fs.writeFile(
                `${this.templatesPath}feature_request.md`,
                featureRequest,
                { encoding: 'utf-8' },
              );

              return Promise.all([
                createBugReport,
                createCustom,
                createFeatReq,
              ]);
            },
            err => {
              reject(
                new DirError(err, this.templatesPath, this.constructor.name),
              );
            },
          )
          .then(
            () => {
              logger.info(
                'Succesully added issue templates file into .github/ISSUE_TEMPLATE directory. You may customize them to suit your needs.',
              );
              resolve();
            },
            err => {
              reject(
                new WriteFileError(
                  err,
                  `${__dirname}/template_files`,
                  this.constructor.name,
                ),
              );
            },
          );
      });
    }
    return;
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
