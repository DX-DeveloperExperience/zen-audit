export default interface Stack {
  isAvailable(path: string): boolean;
  name(): string;
}
