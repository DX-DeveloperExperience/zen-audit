import * as utils from 'util';
import * as fs from 'fs';

const exists = utils.promisify(fs.exists);

export function existsPaths(...paths: string[]): Promise<boolean> {
  return Promise.all(paths.map(path => exists(path)))
    .then(exist => {
      return exist.includes(true);
    })
    .catch(e => false);
}
