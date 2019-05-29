import { StackRegister } from '../stack-register';
import axios from 'axios';

@StackRegister.register
export class Elasticsearch {
  constructor(private readonly rootPath: string = './') {}
  private isElasticsearchResponse() {
    return axios
      .get(this.rootPath, {
        timeout: 3000,
      })
      .then(result => {
        const elasticSearchResponse = JSON.parse(result.data);
        return elasticSearchResponse.tagline === 'You Know, for Search';
      })
      .catch(err => {
        return false;
      });
  }

  async isAvailable(): Promise<boolean> {
    return (
      this.rootPath.startsWith(`http`) && (await this.isElasticsearchResponse())
    );
  }

  name() {
    return this.constructor.name;
  }
}
