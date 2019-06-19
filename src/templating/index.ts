import * as fs from 'fs-extra';
import * as mustache from 'mustache';
import Globals from '../utils/globals/index';
import { logger } from '../logger/index';

export function generateReport(rules: {
  rulesInfos: Array<{
    name: string;
    shortDescription: string;
    longDescription: string;
  }>;
}) {
  return fs
    .readFile(__dirname + '/report.md', { encoding: 'utf-8' })
    .then((markdown: string) => {
      const output = mustache.render(markdown, rules);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
      const reportDirPath = `${Globals.rootPath}zodit-reports`;
      const reportFilePath = `${reportDirPath}/report-${dateString}.md`;
      return fs
        .ensureDir(reportDirPath)
        .then(() => {
          return fs
            .writeFile(reportFilePath, output, {
              encoding: 'utf-8',
            })
            .then(() => {
              logger.info(`Generated Zodit report at: ${reportFilePath}`);
            })
            .catch(err => {
              logger.error(
                `Error trying to write report file : ${reportFilePath}`,
              );
              logger.debug(err.stack);
            });
        })
        .catch(err => {
          logger.error(
            `Error trying to ensure existence of directory : ${reportDirPath}`,
          );
          logger.debug(err.stack);
        });
    })
    .catch(err => {
      logger.error(`Unable to read file: ${__dirname + '/repord.md'}`);
      logger.debug(err.stack);
    });
}
