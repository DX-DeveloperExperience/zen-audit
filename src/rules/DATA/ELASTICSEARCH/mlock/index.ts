import { Register } from './../../../../register/index';
import { FetchDataError } from '../../../../errors/fetch-data-errors';
import Elasticsearch from '../../../../stacks/elasticsearch';
import Globals from '../../../../utils/globals';
import { YesNo } from '../../../../choice';
import Axios from 'axios';

@Register.ruleForStacks([Elasticsearch])
export class ElasticsearchMlock {
  async shouldBeApplied(): Promise<boolean> {
    const url = `${Globals.rootPath}_nodes`;
    return Axios.get(url)
      .then(result => {
        const mlockDisabled = Object.values(result.data.nodes).find(
          (node: any) => !node.process.mlock,
        );
        return !!mlockDisabled;
      })
      .catch(err => {
        throw new FetchDataError(err, url, this.constructor.name);
      });
  }

  getName() {
    return 'Elasticsearch Mlock';
  }

  getShortDescription() {
    return 'In order to improve the performance of your cluster, you should set the disabled swapping';
  }

  getLongDescription() {
    return 'You will find more information on the official documentation : https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-configuration-memory.html#bootstrap-memory_lock';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
