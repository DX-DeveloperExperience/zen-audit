import { RuleRegister } from '../rule-register';
import { StackRegister } from '../../stacks/stack-register';
import { nodeSchedule, setNodeSchedule } from './constants';
import { YesNo } from '../../choice';
import * as cp from 'child_process';
import TypeScript from '../../stacks/typescript';
import Node from '../../stacks/node';
import axios from 'axios';

@RuleRegister.register
@StackRegister.registerRuleForStacks([Node, TypeScript])
export class NodeVersion {
  readonly requiredFiles: string[] = [];
  private nodeVersionSchedule: any;
  private nodeVersion: string = '';
  private shortNodeVersion: string = '';
  private initialized: boolean = false;

  constructor() {
    this.nodeVersion = cp.execSync('node --version').toString();
    this.shortNodeVersion = this.nodeVersion.split('.')[0];
  }

  private async init() {
    if (!this.initialized) {
      return axios
        .get(
          'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
          { timeout: 3000 },
        )
        .catch(err => {
          this.nodeVersionSchedule = nodeSchedule;
          throw err;
        })
        .then(result => {
          const fetchedSchedule = result.data;
          this.nodeVersionSchedule = fetchedSchedule;
          setNodeSchedule(fetchedSchedule);
        });
    }
  }

  async shouldBeApplied() {
    return this.init().then(() => {
      return this.isCritical() || this.isOutdated();
    });
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

  getShortDescription() {
    if (this.isOutdated()) {
      const endDate = this.nodeVersionSchedule[this.shortNodeVersion].end;
      return `Your NodeJS version : ${this.nodeVersion}
      is outdated (${endDate}), you really should update it.`;
    } else {
      const maintenanceDate = this.nodeVersionSchedule[this.shortNodeVersion]
        .maintenance;
      return `Your NodeJS version : ${this.nodeVersion}
      is not maintained anymore, you should consider updating it.`;
    }
  }

  getLongDescription() {
    return 'Laborum exercitation incididunt nulla veniam labore esse. Pariatur adipisicing sint aliqua adipisicing culpa consequat reprehenderit excepteur eiusmod. Est irure voluptate fugiat enim minim laborum. Magna anim eiusmod consectetur voluptate. Proident ad ex laborum in adipisicing sit minim aliquip duis. Do non voluptate mollit officia consequat proident ex mollit dolore qui esse sit reprehenderit.';
  }

  getPromptType() {
    return 'list';
  }

  getChoices() {
    return YesNo;
  }
}
