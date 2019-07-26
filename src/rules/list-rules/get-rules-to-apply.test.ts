import { ListRules } from './index';
import { StackRegister } from './../../stacks/stack-register/index';
import { ListStacks } from './../../stacks/list-stacks/index';
import { RuleRegister } from '../rule-register';

test('should return all rules and their subRules', () => {
  /* ListStacks.getAvailableStacks = jest.fn(() => {
    return Promise.resolve([Stack as any]);
  });

  StackRegister.getRulesByStack = jest.fn(() => {
    return [Rule1] as any[];
  });

  RuleRegister.getSubRulesOf = jest.fn(rule => {
    if (rule instanceof Rule1) {
      return [new SubRule1of1(), new SubRule2of1()] as any[];
    } else if (rule instanceof SubRule1of1) {
      return [new SubRule1ofSubRule1of1()] as any[];
    } else if (rule instanceof SubRule1ofSubRule1of1) {
      return [
        new SubRule1ofSubRule1ofSubRule1of1(),
        new SubRule2ofSubRule1ofSubRule1of1(),
      ] as any[];
    } else if (rule instanceof SubRule1ofSubRule2of1) {
      return [] as any[];
    } else if (rule instanceof SubRule2of1) {
      return [new SubRule1ofSubRule2of1()] as any[];
    }
    return [];
  });

  return ListRules.getRulesToApply().then(result => {
    expect(result.length).toBe(4);
    expect(result[0] instanceof Rule1).toBeTruthy();
    expect(result[1] instanceof SubRule1of1).toBeTruthy();
    expect(result[2] instanceof SubRule1ofSubRule1of1).toBeTruthy();
    expect(result[3] instanceof SubRule2ofSubRule1ofSubRule1of1).toBeTruthy();
  });
});

class Stack {}

class Rule1 {
  shouldBeApplied() {
    return Promise.resolve(true);
  }
}

class SubRule1of1 {
  shouldBeApplied() {
    return Promise.resolve(true);
  }
}

class SubRule1ofSubRule1of1 {
  shouldBeApplied() {
    return Promise.resolve(true);
  }
}

class SubRule1ofSubRule1ofSubRule1of1 {
  shouldBeApplied() {
    return Promise.resolve(false);
  }
}
class SubRule2ofSubRule1ofSubRule1of1 {
  shouldBeApplied() {
    return Promise.resolve(true);
  }
}

class SubRule2of1 {
  shouldBeApplied() {
    return Promise.resolve(false);
  }
}

class SubRule1ofSubRule2of1 {
  shouldBeApplied() {
    return Promise.resolve(true);
  } */
});
