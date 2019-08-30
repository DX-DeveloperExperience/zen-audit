import * as Path from 'path';
export default class Globals {
  static rootPath: string = Path.resolve('.') + '/';
  static get packageJSONPath(): string {
    return `${Globals.rootPath}package.json`;
  }
  static projectName: string = '';
  static ourName: string = 'ZenAudit';
}
