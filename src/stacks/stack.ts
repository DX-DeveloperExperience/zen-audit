export default interface Stack {
  readonly requiredFiles: string[];
  existsInPaths(paths: string[]): boolean;
}
