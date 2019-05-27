import { Node } from '../../stacks/node';
import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { TypeScript } from '../../stacks/typescript';
import request from 'sync-request';
import * as cp from 'child_process';
import * as fs from 'fs';
import { YesNo } from '../../choice';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class NodeVersion {
  readonly requiredFiles: string[] = [];
  readonly rootPath: string;
  private nodeVersionSchedule: any;
  private nodeVersion: string = '';
  private shortNodeVersion: string = '';

  constructor(rootPath: string = './') {
    this.rootPath = rootPath;
    this.nodeVersion = cp.execSync('node --version').toString();
    this.shortNodeVersion = this.nodeVersion.split('.')[0];

    try {
      this.nodeVersionSchedule = JSON.parse(
        request(
          'GET',
          'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
          {
            timeout: 3000,
          },
        )
          .getBody()
          .toString(),
      );
    } catch (err) {
      this.nodeVersionSchedule = JSON.parse(
        fs.readFileSync('./etc/node-schedule.json', {
          encoding: 'utf-8',
        }),
      );
    }
  }

  async shouldBeApplied() {
    return this.isCritical() || this.isOutdated();
  }

  private isCritical() {
    const now = Date.now();
    const maintenance = Date.parse(
      this.nodeVersionSchedule[this.shortNodeVersion].maintenance,
    );
    const end = Date.parse(this.nodeVersionSchedule[this.shortNodeVersion].end);

    return maintenance < now && now < end;
  }

  private isOutdated() {
    const now = Date.now();
    const end = Date.parse(this.nodeVersionSchedule[this.shortNodeVersion].end);

    return end < now;
  }

  getName() {
    return 'Node Version';
  }

  getDescription() {
    if (this.isOutdated()) {
      const endDate = this.nodeVersionSchedule[this.shortNodeVersion].end;
      return `Your NodeJS version : ${this.nodeVersion}
      is outdated (${endDate}), you really should update it. Update it ?`;
    } else {
      const maintenanceDate = this.nodeVersionSchedule[this.shortNodeVersion]
        .maintenance;
      return `Your NodeJS version : ${this.nodeVersion}
      is not maintained anymore, you should consider updating it. Update it ?`;
    }
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
