import { Register } from './../../../../register/index';
import { FetchDataError } from '../../../../errors/fetch-data-errors';
import { YesNo } from '../../../../choice/index';
import Axios from 'axios';
import Elasticsearch from '../../../../stacks/elasticsearch';
import Globals from '../../../../utils/globals';

@Register.ruleForStacks([Elasticsearch])
export class ElasticsearchNodesNumber {
  async shouldBeApplied(): Promise<boolean> {
    const url = `${Globals.rootPath}_nodes`;
    return Axios.get(url)
      .then(result => {
        return Object.keys(result.data.nodes).length < 3;
      })
      .catch(err => {
        throw new FetchDataError(err, url, this.constructor.name);
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
