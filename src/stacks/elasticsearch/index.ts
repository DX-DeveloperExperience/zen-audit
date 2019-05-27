import { StackRegister } from '../stack-register';
import request from 'sync-request';

@StackRegister.register
export class Elasticsearch {
  constructor(private readonly rootPath: string = './') {}
  private isElasticsearchResponse() {
    try {
      const elasticsearchResponse = JSON.parse(
        request('GET', this.rootPath, {
          timeout: 3000,
        })
          .getBody()
          .toString(),
      );
      return elasticsearchResponse.tagline === 'You Know, for Search';
    } catch (e) {
      return false;
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.rootPath.startsWith(`http`) && this.isElasticsearchResponse();
  }

  name() {
    return this.constructor.name;
  }
}
