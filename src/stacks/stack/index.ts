export default interface Stack {
  isAvailable(): Promise<boolean>;
  name(): string;
}
