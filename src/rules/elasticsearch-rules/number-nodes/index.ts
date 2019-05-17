import { RuleRegister } from '../../rule-register';
import { Elasticsearch } from '../../../stacks/elasticsearch';
import { StackRegister } from '../../../stacks/stack-register';
import request from 'sync-request';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchNodesNumber {
  requiredFiles = [''];
  rootPath: string;

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
  }

  shouldBeApplied() {
    const elasticsearchResponse = JSON.parse(
      request('GET', this.rootPath + '_nodes', {
        timeout: 3000,
      })
        .getBody()
        .toString(),
    );
    return Object.keys(elasticsearchResponse.nodes).length < 3;
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
