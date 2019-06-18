import * as fs from 'fs-extra';
import * as mustache from 'mustache';
import Globals from '../utils/globals/index';

export function generateReport(rules: {
  rulesInfos: Array<{
    name: string;
    shortDescription: string;
    longDescription: string;
  }>;
}) {
  return fs
    .readFile(__dirname + '/test.md', { encoding: 'utf-8' })
    .then((markdown: string) => {
      const output = mustache.render(markdown, rules);
      return fs.writeFile(Globals.rootPath + 'report.md', output, {
        encoding: 'utf-8',
      });
    });
}
