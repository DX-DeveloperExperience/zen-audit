import { StackRegister } from '../stack-register';
import axios from 'axios';
import { pathExistsInJSON } from '../../utils/json/index';
import ProjectFillerCli = require('../../index');

@StackRegister.register
export class Website {
  isAvailable(): Promise<boolean> {
    if (
      !ProjectFillerCli.path.startsWith('http://') &&
      !ProjectFillerCli.path.startsWith('https://')
    ) {
      return Promise.resolve(false);
    } else {
      return axios.get(ProjectFillerCli.path).then(result => {
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
