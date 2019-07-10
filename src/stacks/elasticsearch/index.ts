import { StackRegister } from '../stack-register';
import axios from 'axios';
import Globals from '../../utils/globals/index';

@StackRegister.register
export default class Elasticsearch {
  private isElasticsearchResponse() {
    return axios
      .get(Globals.rootPath, {
        timeout: 3000,
      })
      .then(result => {
        const elasticSearchResponse = result.data;
        return elasticSearchResponse.tagline === 'You Know, for Search';
      })
      .catch(err => {
        err.message = `Elastic Search Stack: Error trying to fetch data at: ${
          Globals.rootPath
        }`;
        throw err;
      });
  }

  async isAvailable(): Promise<boolean> {
    if (Globals.rootPath.startsWith(`http`)) {
      const isElasticsearchResponse = await this.isElasticsearchResponse();

      return isElasticsearchResponse;
    }
    return false;
  }

  name() {
    return this.constructor.name;
  }
}
