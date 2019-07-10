import { StackRegister } from '../stack-register';
import axios from 'axios';
import { pathExistsInJSON } from '../../utils/json/index';
import Globals from '../../utils/globals';

@StackRegister.register
export class Website {
  async isAvailable(): Promise<boolean> {
    if (
      !Globals.rootPath.startsWith('http://') &&
      !Globals.rootPath.startsWith('https://')
    ) {
      return false;
    } else {
      return axios
        .get(Globals.rootPath)
        .then(result => {
          return Promise.resolve(
            pathExistsInJSON(result, ['headers', 'content-type']) &&
              result.headers['content-type'].startsWith('text/html'),
          );
        })
        .catch(err => {
          err.message = `Website Stack: Error while fetching data at url: ${
            Globals.rootPath
          }`;
          throw err;
        });
    }
  }

  name(): string {
    return 'Website';
  }
}
