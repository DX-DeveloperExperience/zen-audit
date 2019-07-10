import Choice, { YesNo } from './../../../../choice/index';
import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import Elasticsearch from '../../../../stacks/elasticsearch';
import inquirer = require('inquirer');
import { cli } from 'cli-ux';
import Axios from 'axios';
import { outputFile } from 'fs-extra';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class IntegrationTests {
  private templateUrl: string =
    'https://github.com/DX-DeveloperExperience/project-starter/releases/download/0.7.0/project-starter-cli-v0.7.0.tar.gz';
  private templateFilePath: string = './elasticsearch-it-template.zip';
  async shouldBeApplied(): Promise<boolean> {
    cli.action.stop();
    return inquirer
      .prompt([
        {
          name: 'hasIntegration',
          message:
            'Do you have integration tests in your elastic search project ?',
          type: 'list',
          choices: YesNo,
        },
      ])
      .then((answer: { hasIntegration: boolean }) => {
        return !answer.hasIntegration;
      });
  }

  async apply(apply: boolean): Promise<void> {
    Axios.get(this.templateUrl, { responseType: 'arraybuffer' })
      .catch(err => {
        err.message = `ElasticSearch Integration Tests: Error retrieving template at ${
          this.templateUrl
        }`;
        throw err;
      })
      .then((response: any) => {
        outputFile(this.templateFilePath, response.data).catch(err => {
          err.message = `Error writing file ${this.templateFilePath}`;
        });
      });
  }

  getName(): string {
    return 'Integration Tests';
  }

  getShortDescription(): string {
    return 'Would you like to download a skeleton of integration tests ?';
  }

  getLongDescription(): string {
    return 'long description long description long description long description long description long description long description long description long description long description long description long description long description long description long description ';
  }
  getPromptType(): string {
    return 'list';
  }

  getChoices(): Choice[] {
    return YesNo;
  }
}
