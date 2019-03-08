export default interface Stack {
  readonly requiredFiles: string[];
  existsInPath(paths: string): boolean;
}
