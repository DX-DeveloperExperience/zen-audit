import { WriteFileError } from '../../../../../errors/file-errors';
import { Ok } from '../../../../../choice';
import * as cp from 'child_process';
import TypeScript from '../../../../../stacks/typescript';
import Node from '../../../../../stacks/node';
import axios from 'axios';
import { ReadFileError } from '../../../../../errors/file-errors';
import { readJSON, writeJSON } from 'fs-extra';
import { logger } from '../../../../../logger';
import { Register } from '../../../../../register';

@Register.ruleForStacks([Node, TypeScript])
export class NodeVersion {
  readonly requiredFiles: string[] = [];
  private nodeVersionSchedule: {} | undefined;
  private nodeVersion: string = '';
  private shortNodeVersion: string = '';
  private nodeScheduleFilePath = `${__dirname}/node_schedule.json`;
  private initialized: boolean = false;

  constructor() {
    this.nodeVersion = cp.execSync('node --version').toString();
    this.shortNodeVersion = this.nodeVersion.split('.')[0];
  }

  async shouldBeApplied() {
    return await (this.isCritical() || this.isOutdated());
  }

  async apply() {
    const nodeSchedule = await this.getVersionSchedule();
    if (this.isOutdated()) {
      const endDate = nodeSchedule[this.shortNodeVersion].end;
      logger.info(`Your NodeJS version : ${this.nodeVersion}
      is outdated (${endDate}), you really should update it.`);
    } else {
      logger.info(`Your NodeJS version : ${this.nodeVersion}
      is not maintained anymore, you should consider updating it.`);
    }
  }

  private async isCritical() {
    const nodeVersionSchedule = await this.getVersionSchedule();
    const now = Date.now();
    const maintenance = Date.parse(
      nodeVersionSchedule[this.shortNodeVersion].maintenance,
    );
    const end = Date.parse(nodeVersionSchedule[this.shortNodeVersion].end);

    return maintenance < now && now < end;
  }

  private async isOutdated() {
    const nodeVersionSchedule = await this.getVersionSchedule();
    const now = Date.now();
    const end = Date.parse(nodeVersionSchedule[this.shortNodeVersion].end);

    return end < now;
  }

  private async getVersionSchedule(): Promise<any> {
    if (this.nodeVersionSchedule !== undefined) {
      return this.nodeVersionSchedule;
    }

    return axios
      .get(
        'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
        { timeout: 3000 },
      )
      .then(result => {
        const fetchedSchedule = result.data;
        this.nodeVersionSchedule = fetchedSchedule;
        // this.updateScheduleJSON(fetchedSchedule);
        return this.nodeVersionSchedule;
      })
      .catch(err => {
        logger.error('NodeVersion: Error while fetching node version schedule');
        logger.debug(err);
        this.nodeVersionSchedule = require(this.nodeScheduleFilePath);
        return this.nodeVersionSchedule;
      });
  }

  private async updateScheduleJSON(newSchedule: any): Promise<void> {
    return new Promise((resolve, reject) => {
      return readJSON(this.nodeScheduleFilePath)
        .then(
          scheduleJSON => {
            if (JSON.stringify(scheduleJSON) === JSON.stringify(newSchedule)) {
              return writeJSON(this.nodeScheduleFilePath, scheduleJSON, {
                spaces: '\t',
              });
            }
            return Promise.resolve();
          },
          err => {
            reject(
              new ReadFileError(
                err,
                this.nodeScheduleFilePath,
                this.constructor.name,
              ),
            );
          },
        )
        .then(
          () => {
            resolve();
          },
          err => {
            reject(
              new WriteFileError(
                err,
                this.nodeScheduleFilePath,
                this.constructor.name,
              ),
            );
          },
        );
    });
  }

  getName() {
    return 'Node Version';
  }

  getShortDescription() {
    return 'Node version: This rule will check your nodeJS version, and tell you if you should update it.';
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return Ok;
  }
}
