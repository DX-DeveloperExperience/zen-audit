import { RuleRegister } from '../../rules/rule-register';

class Rule1 {}
class Rule2 {}

test('getImplementations() should return an array containing the two Rule classes', () => {
  RuleRegister.register(Rule1 as any);
  RuleRegister.register(Rule2 as any);

  const rulesArray = RuleRegister.getImplementations();

  expect(rulesArray.length).toBe(2);
  expect(new rulesArray[0]()).toBeInstanceOf(Rule1);
  expect(new rulesArray[1]()).toBeInstanceOf(Rule2);
});
