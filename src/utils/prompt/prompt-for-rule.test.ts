import { RuleRegister } from './../../rules/rule-register/index';
import { YesNo } from './../../choice/index';
import { promptForRule } from '.';

const inquirer = require('inquirer');

jest.mock('inquirer');
jest.mock('../../logger');

test('should prompt for rule and its subRules', () => {
  RuleRegister.getSubRulesOf = jest.fn(rule => {
    if (rule instanceof Rule1) {
      return [new SubRule1() as any, new SubRule2() as any];
    }
    if (rule instanceof SubRule1) {
      return [new SubSubRule1() as any];
    }
    return [];
  });

  inquirer.prompt = jest.fn(() => {
    return Promise.resolve();
  });

  return promptForRule(new Rule1() as any).then(() => {
    expect(inquirer.prompt).toBeCalledTimes(4);
  });
});

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
