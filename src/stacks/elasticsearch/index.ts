import { StackRegister } from '../stack-register';
import axios from 'axios';

@StackRegister.register
export default class Elasticsearch {
  constructor(private readonly rootPath: string = './') {}
  private isElasticsearchResponse() {
    return axios
      .get(this.rootPath, {
        timeout: 3000,
      })
      .then(result => {
        const elasticSearchResponse = result.data;
        return elasticSearchResponse.tagline === 'You Know, for Search';
      })
      .catch(err => {
        return false;
      });
  }

  async isAvailable(): Promise<boolean> {
    if (this.rootPath.startsWith(`http`)) {
      const isElasticsearchResponse = await this.isElasticsearchResponse();

      return Promise.resolve(isElasticsearchResponse);
    }
    return Promise.resolve(false);
  }

  name() {
    return this.constructor.name;
  }
}
