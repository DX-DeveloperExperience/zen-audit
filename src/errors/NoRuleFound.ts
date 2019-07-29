export class NoRuleFound extends Error {
  constructor() {
    super(`No rule found`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
