import { StackRegister } from '../stack-register';
import axios from 'axios';
import { pathExistsInJSON } from '../../utils/json/index';
import Globals from '../../utils/globals';
// import ProjectFillerCli = require('../../index');

@StackRegister.register
export class Website {
  isAvailable(): Promise<boolean> {
    if (
      !Globals.rootPath.startsWith('http://') &&
      !Globals.rootPath.startsWith('https://')
    ) {
      return Promise.resolve(false);
    } else {
      return axios.get(Globals.rootPath).then(result => {
        return Promise.resolve(
          pathExistsInJSON(result, ['headers', 'content-type']) &&
            result.headers['content-type'].startsWith('text/html'),
        );
      });
    }
  }

  name(): string {
    return 'Website';
  }
}
