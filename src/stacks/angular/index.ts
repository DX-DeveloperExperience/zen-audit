import { StackRegister } from '../stack-register';
import Globals from '../../utils/globals';
import { pathExistsInJSON } from '../../utils/json/index';
import { getExactSemver } from '../../utils/semver/index';

@StackRegister.register
export default class Angular {
  readonly libraryVersion: string = '';
  readonly generatedCLI: boolean = false;
  private informations: string[] = [];
  private hasAngularDependency: boolean = false;
  private parsedJSON: any;

  constructor() {
    try {
      this.parsedJSON = require(`${Globals.rootPath}package.json`);
      if (
        pathExistsInJSON(this.parsedJSON, ['dependencies', '@angular/core'])
      ) {
        this.libraryVersion = this.getLibraryVersion();
        this.generatedCLI = this.isGeneratedCLI();
      } else {
        this.hasAngularDependency = false;
      }
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        this.hasAngularDependency = false;
      }
      throw e;
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.hasAngularDependency;
  }

  private isGeneratedCLI(): boolean {
    const isGeneratedCLI = pathExistsInJSON(this.parsedJSON, [
      'devDependencies',
      '@angular/cli',
    ]);

    this.informations.push(
      'This Angular application has been generated with the Angular CLI',
    );

    return isGeneratedCLI;
  }

  private getLibraryVersion(): string {
    const version = getExactSemver(
      this.parsedJSON.dependencies['@angular/core'],
    );

    this.informations.push(`Angular version: ${version}`);

    return version;
  }

  getInformations(): string[] {
    return this.informations;
  }

  name() {
    return this.constructor.name;
  }
}
