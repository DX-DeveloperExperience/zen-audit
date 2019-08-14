import { DirError } from './../errors/DirErrors';
import { WriteFileError } from './../errors/FileErrors';
import { Ok } from '../choice/index';
import * as fs from 'fs-extra';
import * as mustache from 'mustache';
import Globals from '../utils/globals/index';
import { logger } from '../logger/index';
import * as inquirer from 'inquirer';
import { ReadFileError } from '../errors/FileErrors';
const mdpdf = require('mdpdf');

const date = new Date();
const dateString = `${date.getFullYear()}-${date.getMonth() +
  1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

export function generateReport(reportData: {
  projectName: string;
  rulesInfos: Array<{
    name: string;
    shortDescription: string;
    longDescription: string;
  }>;
}) {
  const reportDirPath = Globals.rootPath.startsWith('http')
    ? `./${Globals.ourName}-reports/`
    : `${Globals.rootPath}${Globals.ourName}-reports/`;

  return new Promise<void>((resolve, reject) => {
    fs.readFile(__dirname + '/report.md', { encoding: 'utf-8' })
      .then(
        (markdown: string) => {
          const output = mustache.render(markdown, reportData);
          return generateMarkdown(output, reportDirPath);
        },
        err => {
          reject(
            new ReadFileError(err, __dirname + '/report.md', 'Generate Report'),
          );
        },
      )
      .then(
        () => {
          return markdownToPdfPrompt();
        },
        err => {
          reject(err);
        },
      )
      .then(
        () => {
          return markdownToPdf(reportDirPath);
        },
        err => {
          reject(err);
        },
      )
      .then(
        () => {
          resolve();
        },
        err => {
          reject(err);
        },
      );
  }).catch(err => {
    throw err;
  });
}

async function generateMarkdown(data: string, reportDirPath: string) {
  const reportFilePath = `${reportDirPath}report-${dateString}`;
  const reportMarkdownPath = `${reportFilePath}.md`;

  return new Promise((resolve, reject) => {
    fs.ensureDir(reportDirPath)
      .then(
        () => {
          return fs.writeFile(reportMarkdownPath, data, {
            encoding: 'utf-8',
          });
        },
        err => {
          reject(new DirError(err, reportDirPath, 'Generate Report'));
        },
      )
      .then(
        () => {
          logger.info(
            `Generated ${
              Globals.ourName
            } markdown report at: ${reportMarkdownPath}`,
          );
          resolve();
        },
        err => {
          reject(
            new WriteFileError(err, reportMarkdownPath, 'Generate Report'),
          );
        },
      );
  }).catch(err => {
    throw err;
  });
}

async function markdownToPdf(reportDirPath: string) {
  const reportFilePath = `${reportDirPath}report-${dateString}`;
  const reportMarkdownPath = `${reportFilePath}.md`;
  const reportPdfPath = `${reportFilePath}.pdf`;

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
      err.message = 'Generate Report: Error while converting markdown to PDF';
      throw err;
    });
}

async function markdownToPdfPrompt() {
  return inquirer
    .prompt([
      {
        name: 'convert',
        message:
          "We're about to convert your markdown generated report to PDF, you may update your markdown before the conversion, when you're ready, confirm for conversion.",
        type: 'list',
        choices: Ok,
      },
    ])
    .catch(err => {
      err.message = 'Generate Report: Error prompting for conversion';
      throw err;
    });
}
