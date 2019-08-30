import { Register } from './../../../../register/index';
import { WriteFileError } from '../../../../errors/file-errors';
import { FetchDataError } from '../../../../errors/fetch-data-errors';
import Choice, { YesNo } from '../../../../choice/index';
import Elasticsearch from '../../../../stacks/elasticsearch';
import inquirer = require('inquirer');
import { cli } from 'cli-ux';
import Axios from 'axios';
import { outputFile } from 'fs-extra';
import { logger } from '../../../../logger';

@Register.ruleForStacks([Elasticsearch])
export class IntegrationTests {
  private templateUrl: string =
    'https://github.com/DX-DeveloperExperience/testcontainer-elasticsearch/archive/1.0-SNAPSHOT.tar.gz';
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

  async apply(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Axios.get(this.templateUrl, { responseType: 'arraybuffer' })
        .then(
          (response: any) => {
            return outputFile(this.templateFilePath, response.data);
          },
          err => {
            reject(
              new FetchDataError(err, this.templateUrl, this.constructor.name),
            );
          },
        )
        .then(
          () => {
            resolve();
          },
          err => {
            logger.debug(err);
            reject(
              new WriteFileError(
                err,
                this.templateFilePath,
                this.constructor.name,
              ),
            );
          },
        );
    });
  }

  getName(): string {
    return 'Integration Tests';
  }

  getShortDescription(): string {
    return 'Would you like to download a skeleton of integration tests ?';
  }

  getLongDescription(): string {
    return 'This skeleton use the testcontainers library. You can have a look to the official documentation https://www.testcontainers.org';
  }
  getPromptType(): string {
    return 'list';
  }

  getChoices(): Choice[] {
    return YesNo;
  }
}
