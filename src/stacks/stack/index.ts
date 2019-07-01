export default interface Stack {
  isAvailable(): Promise<boolean>;
  getInformations?: () => string[];
  name(): string;
}
