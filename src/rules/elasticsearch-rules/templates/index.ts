import { RuleRegister } from '../../rule-register';
import Elasticsearch from '../../../stacks/elasticsearch';
import { StackRegister } from '../../../stacks/stack-register';
import axios from 'axios';
import { YesNo } from '../../../choice';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchTemplate {
  requiredFiles = [''];
  rootPath: string;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
  }

  async shouldBeApplied(): Promise<boolean> {
    return axios
      .get(`${this.rootPath}_template`)
      .then(({ data: templates }) => {
        return (
          Object.keys(templates).filter(
            templateName => !templateName.startsWith('.'),
          ).length === 0
        );
      });
  }

  getName() {
    return 'Elasticsearch Template';
  }

  getShortDescription() {
    return 'You should use templates for configuring your indices';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
