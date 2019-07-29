import { RuleRegister } from '.';

test('should return registered subRules', () => {
  RuleRegister.register(Rule1 as any);
  RuleRegister.register(Rule2 as any);

  RuleRegister.registerSubRuleOf(Rule1 as any)(SubRule1of1 as any);
  RuleRegister.registerSubRuleOf(Rule1 as any)(SubRule2of1 as any);

  RuleRegister.registerSubRuleOf(Rule2 as any)(SubRule1of2 as any);

  expect(RuleRegister.getSubRulesOf(new Rule1() as any).length).toBe(2);
});

class Rule1 {}
class SubRule1of1 {}
class SubRule2of1 {}

class Rule2 {}
class SubRule1of2 {}
