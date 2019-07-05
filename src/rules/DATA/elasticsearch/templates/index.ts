import { YesNo } from '../../../../choice/index';
import { RuleRegister } from '../../../rule-register/index';
import { StackRegister } from '../../../../stacks/stack-register';
import Elasticsearch from '../../../../stacks/elasticsearch';
import Axios from 'axios';
import Globals from '../../../../utils/globals';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchTemplate {
  async shouldBeApplied(): Promise<boolean> {
    return Axios.get(`${Globals.rootPath}_template`).then(
      ({ data: templates }) => {
        return (
          Object.keys(templates).filter(
            templateName => !templateName.startsWith('.'),
          ).length === 0
        );
      },
    );
  }

  getName() {
    return 'Elasticsearch Template';
  }

  getShortDescription() {
    return 'You should use templates for configuring your indices';
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
