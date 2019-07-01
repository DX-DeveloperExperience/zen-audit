import { RuleRegister } from '../../rule-register';
import { StackRegister } from '../../../stacks/stack-register';
import { YesNo } from '../../../choice';
import Elasticsearch from '../../../stacks/elasticsearch';
import axios from 'axios';
import Globals from '../../../utils/globals';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Elasticsearch])
export class ElasticsearchNodesNumber {
  async shouldBeApplied(): Promise<boolean> {
    return axios.get(`${Globals.rootPath}_nodes`).then(result => {
      return Object.keys(result.data.nodes).length < 3;
    });
  }

  getName() {
    return 'Elasticsearch Nodes';
  }

  getShortDescription() {
    return 'An Elasticsearch cluster should at least has 3 nodes';
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
