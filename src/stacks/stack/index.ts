export default interface Stack {
  isAvailable(): boolean;
  isAvailableProm(): Promise<boolean>;
  name(): string;
}
