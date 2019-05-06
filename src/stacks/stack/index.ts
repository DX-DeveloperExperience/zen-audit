export default interface Stack {
  isInPath(path: string): boolean;
  name(): string;
}
