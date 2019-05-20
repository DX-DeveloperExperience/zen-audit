import { StackRegister } from '../../stacks/stack-register';

class Stack1 {}
class Stack2 {}

class Rule1 {}
class Rule2 {}

test('getImplementations() should return an array containing two class constructors', () => {
  StackRegister.register(Stack1 as any);

  expect(StackRegister.getImplementations().length).toBe(1);
});

test('getRulesByStack(stackName) should return an array containing the Rule constructor', () => {
  StackRegister.register(Stack1 as any);
  StackRegister.register(Stack2 as any);

  StackRegister.registerRuleForStacks([Stack1 as any, Stack2 as any])(
    Rule1 as any,
  );
  StackRegister.registerRuleForStacks([Stack1 as any])(Rule2 as any);

  const rulesArray1 = StackRegister.getRulesByStack(Stack1.name);
  const rulesArray2 = StackRegister.getRulesByStack(Stack2.name);

  expect(rulesArray1.length).toBe(2);
  expect(rulesArray2.length).toBe(1);

  expect(new rulesArray1[0]()).toBeInstanceOf(Rule1);
  expect(new rulesArray1[1]()).toBeInstanceOf(Rule2);
});
