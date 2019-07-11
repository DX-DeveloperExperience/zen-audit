import { Ok } from './../choice/index';
import * as fs from 'fs-extra';
import * as mustache from 'mustache';
import Globals from '../utils/globals/index';
import { logger } from '../logger/index';
import * as inquirer from 'inquirer';
const mdpdf = require('mdpdf');

const date = new Date();
const dateString = `${date.getFullYear()}-${date.getMonth() +
  1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
const reportDirPath = Globals.rootPath.startsWith('http')
  ? './zodit-reports/'
  : `${Globals.rootPath}zodit-reports/`;
const reportFilePath = `${reportDirPath}report-${dateString}`;
const reportMarkdownPath = `${reportFilePath}.md`;
const reportPdfPath = `${reportFilePath}.pdf`;

export function generateReport(reportData: {
  projectName: string;
  rulesInfos: Array<{
    name: string;
    shortDescription: string;
    longDescription: string;
  }>;
}) {
  fs.readFile(__dirname + '/report.md', { encoding: 'utf-8' })
    .catch(err => {
      logger.error(`Unable to read file: ${__dirname + '/repord.md'}`);
      logger.debug(err.stack);
    })
    .then((markdown: string) => {
      const output = mustache.render(markdown, reportData);
      return generateMarkdown(output);
    })
    .then(() => {
      return markdownToPdfPrompt();
    })
    .then(() => {
      return markdownToPdf();
    })
    .catch(err => {
      logger.error(err.message);
      logger.debug(err.stack);
    });
}

async function generateMarkdown(data: string) {
  return fs
    .ensureDir(reportDirPath)
    .catch(err => {
      err.message = `Error trying to ensure existence of directory : ${reportDirPath}`;
      throw err;
    })
    .then(() => {
      return fs.writeFile(reportMarkdownPath, data, {
        encoding: 'utf-8',
      });
    })
    .catch(err => {
      err.message = `Error trying to write report file : ${reportMarkdownPath}`;
      throw err;
    })
    .then(() => {
      logger.info(`Generated Zodit markdown report at: ${reportMarkdownPath}`);
    });
}

async function markdownToPdf() {
  return mdpdf
    .convert({
      source: reportMarkdownPath,
      destination: reportPdfPath,
      styles: `${__dirname}/style.css`,
      pdf: {
        format: 'A4',
      },
    })
    .then(() => {
      logger.info(
        `Succesfully converted markdown report to PDF at: ${reportPdfPath}`,
      );
    })
    .catch((err: any) => {
      err.message = `Error while converting markdown report to PDF`;
      throw err;
    });
}

async function markdownToPdfPrompt() {
  return inquirer.prompt([
    {
      name: 'convert',
      message:
        "We're about to convert your markdown generated report to PDF, you may update your markdown before the conversion, when you're ready, confirm for conversion.",
      type: 'list',
      choices: Ok,
    },
  ]);
}
