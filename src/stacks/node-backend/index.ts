import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json/index';
import Node from '../node';
import { Register } from '../../register';

@Register.subStackOf(Node)
export class NodeBackend {
  private hasExpress: boolean = false;
  private hasRestify: boolean = false;
  private hasNestJS: boolean = false;
  private hasHapi: boolean = false;
  private parsedJSON: any;

  constructor() {
    this.parsedJSON = require(`${Globals.rootPath}package.json`);
    this.hasExpress = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      'express',
    ]);
    this.hasRestify = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      'restify',
    ]);
    this.hasNestJS = pathExistsInJSON(this.parsedJSON, [
      'dependencies',
      '@nestjs/core',
    ]);
    this.hasHapi = pathExistsInJSON(this.parsedJSON, ['dependencies', 'hapi']);
  }

  async isAvailable(): Promise<boolean> {
    return this.hasNestJS || this.hasExpress || this.hasRestify || this.hasHapi;
  }

  name(): string {
    return 'Node Backend';
  }
}
