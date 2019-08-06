import { RuleRegister } from './../../rules/rule-register/index';
import { YesNo } from './../../choice/index';
import { promptForRules } from '.';

jest.mock('../../logger');

class Rule1 {
  async shouldBeApplied() {
    return true;
  }

  async apply() {
    //
  }

  getName() {
    return '';
  }

  getShortDescription() {
    return '';
  }

  getPromptType() {
    return '';
  }

  async getChoices() {
    return YesNo;
  }
}

class SubRule1 {
  async shouldBeApplied() {
    return true;
  }

  async apply() {
    //
  }

  getName() {
    return '';
  }

  getShortDescription() {
    return '';
  }

  getPromptType() {
    return '';
  }

  async getChoices() {
    return YesNo;
  }
}

class SubSubRule1 {
  async shouldBeApplied() {
    return true;
  }

  async apply() {
    //
  }

  getName() {
    return '';
  }

  getShortDescription() {
    return '';
  }

  getPromptType() {
    return '';
  }

  async getChoices() {
    return YesNo;
  }
}

class SubRule2 {
  async shouldBeApplied() {
    return true;
  }

  async apply() {
    //
  }

  getName() {
    return '';
  }

  getShortDescription() {
    return '';
  }

  getPromptType() {
    return '';
  }

  async getChoices() {
    return YesNo;
  }
}

test('should prompt for rule and its subRules', () => {
  // RuleRegister.getSubRulesOf = jest.fn(rule => {
  //   if (rule instanceof Rule1) {
  //     return [subRule1 as any, subRule2 as any];
  //   }
  //   if (rule instanceof SubRule1) {
  //     return [subSubRule1 as any];
  //   }
  //   return [];
  // });
  // const rule1 = new Rule1();
  // const subRule1 = new SubRule1();
  // const subRule2 = new SubRule2();
  // const subSubRule1 = new SubSubRule1();
  // rule1.apply = jest.fn(() => {
  //   return Promise.resolve();
  // });
  // subRule1.apply = jest.fn(() => {
  //   return Promise.resolve();
  // });
  // subSubRule1.apply = jest.fn(() => {
  //   return Promise.resolve();
  // });
  // subRule2.apply = jest.fn(() => {
  //   return Promise.resolve();
  // });
  // return promptForRules([rule1 as any]).then(() => {
  //   expect(rule1.apply).toBeCalledTimes(1);
  //   expect(subRule1.apply).toBeCalledTimes(1);
  //   expect(subSubRule1.apply).toBeCalledTimes(1);
  //   expect(subRule2.apply).toBeCalledTimes(1);
  // });
});
