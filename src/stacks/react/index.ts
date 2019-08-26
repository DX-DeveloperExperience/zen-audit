import { pathExistsInJSON } from '../../utils/json/index';
import Globals from '../../utils/globals';
import { getExactSemver } from '../../utils/semver/index';
import { ReadFileError } from '../../errors/file-errors';
import { Register } from '../../register';

@Register.stack
export class React {
  readonly libraryVersion: string = '';
  readonly generatedCLI: boolean = false;
  private hasReactDependency: boolean = false;
  private parsedJSON: any;
  private informations: string[] = [];

  constructor() {
    try {
      this.parsedJSON = require(Globals.packageJSONPath);
      if (pathExistsInJSON(this.parsedJSON, ['dependencies', 'react'])) {
        this.libraryVersion = this.getLibraryVersion();
        this.generatedCLI = this.isGeneratedCLI();

        this.hasReactDependency = true;
      } else {
        this.hasReactDependency = false;
      }
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        this.hasReactDependency = false;
        return;
      }
      throw new ReadFileError(
        err,
        Globals.packageJSONPath,
        this.constructor.name,
      );
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.hasReactDependency;
  }

  private isGeneratedCLI() {
    const isGeneratedCLI =
      pathExistsInJSON(this.parsedJSON, ['dependencies', 'react-scripts']) ||
      pathExistsInJSON(this.parsedJSON, ['devDependencies', 'react-scripts']);

    if (isGeneratedCLI) {
      this.informations.push(
        'This React application has been generated using the Create React App CLI',
      );
    }

    return isGeneratedCLI;
  }

  private getLibraryVersion() {
    const version = getExactSemver(this.parsedJSON.dependencies.react);
    this.informations.push(`React version: ${version}`);

    return version;
  }

  getInformations(): string[] {
    return this.informations;
  }

  name(): string {
    return 'React';
  }
}
