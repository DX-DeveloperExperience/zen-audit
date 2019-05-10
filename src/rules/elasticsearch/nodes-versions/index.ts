import { RuleRegister } from '../../rule-register';
import { Elasticsearch } from '../../../stacks/elasticsearch';
import { StackRegister } from '../../../stacks/stack-register';
import request from 'sync-request';
import { Ok } from '../../../choice';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchNodes {
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
    const versions = Object.values(elasticsearchResponse.nodes).map(
      (node: any) => node.version,
    );
    const set = new Set(versions);
    return set.size > 1;
  }

  getName() {
    return 'Elasticsearch Version';
  }

  getDescription() {
    return 'An Elasticsearch cluster should have all nodes using the same version of Elasticsearch';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return Ok;
  }
}
