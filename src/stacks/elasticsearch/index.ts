import { FetchDataError } from '../../errors/fetch-data-errors';
import axios from 'axios';
import Globals from '../../utils/globals/index';
import { Register } from '../../register';

@Register.stack
export default class Elasticsearch {
  static version: string = '';
  private isElasticsearchResponse() {
    return axios
      .get(Globals.rootPath, {
        timeout: 3000,
      })
      .then(result => {
        const elasticSearchResponse = result.data;
        if (elasticSearchResponse.tagline === 'You Know, for Search') {
          Elasticsearch.version = elasticSearchResponse.version.number;
          return true;
        }
        return false;
      })
      .catch(err => {
        throw new FetchDataError(err, Globals.rootPath, this.constructor.name);
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
