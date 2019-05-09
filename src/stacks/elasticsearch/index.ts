import { StackRegister } from '../stack-register';
import request from 'sync-request';

@StackRegister.register
export class Elasticsearch {
  constructor(private path: string) {}
  private isElasticsearchResponse() {
    try {
      const elasticsearchResponse = JSON.parse(
        request('GET', this.path, {
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

  isAvailable(path: string) {
    return path.startsWith(`http`) && this.isElasticsearchResponse();
  }
  name() {
    return this.constructor.name;
  }
}
