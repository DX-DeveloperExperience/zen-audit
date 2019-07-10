import Choice, { YesNo } from './../../../../choice/index';
import { RuleRegister } from '../../../rule-register';
import { StackRegister } from '../../../../stacks/stack-register';
import Elasticsearch from '../../../../stacks/elasticsearch';
import inquirer = require('inquirer');
import { cli } from 'cli-ux';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class IntegrationTests {
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
    // TODO
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
