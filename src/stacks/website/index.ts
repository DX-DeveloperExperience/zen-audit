import { FetchDataError } from './../../errors/FetchData';
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
          throw new FetchDataError(
            err,
            Globals.rootPath,
            this.constructor.name,
          );
        });
    }
  }

  name(): string {
    return 'Website';
  }
}
