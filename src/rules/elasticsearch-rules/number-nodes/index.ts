import { RuleRegister } from '../../rule-register';
import { Elasticsearch } from '../../../stacks/elasticsearch';
import { StackRegister } from '../../../stacks/stack-register';
import axios from 'axios';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchNodesNumber {
  requiredFiles = [''];
  rootPath: string;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
  }

  async shouldBeApplied(): Promise<boolean> {
    return axios.get(`${this.rootPath}_nodes`).then(result => {
      const parsed = JSON.parse(result.data);
      return Object.keys(parsed.nodes).length < 3;
    });
  }

  getName() {
    return 'Elasticsearch Nodes';
  }

  getDescription() {
    return 'An Elasticsearch cluster should at least has 3 nodes';
  }

  getPromptType() {
    return '';
  }

  getChoices() {
    return [];
  }
}
