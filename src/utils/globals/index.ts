import * as Path from 'path';
export default class Globals {
  static rootPath: string = Path.resolve('.') + '/';
  static readonly packageJSONPath: string = `${Globals.rootPath}package.json`;
}
