import { StackRegister } from '../../stacks/stack-register';

// @StackRegister.register
// class DummyStack {
//   // Here DummyStack should implement Stack interface but I would like to make a mock of Stack interface so I don't
//   // have to implement Stack methods in my tests
// }

// interface DummyStackInterface {}

// class DummyStackRegisterGenerator extends RegisterGenerator<
//   DummyStackInterface
// > {}
// const dummyStackRegister = new StackRegister();
// const dummyStackRegisterGenerator = new DummyStackRegisterGenerator();

// const register = dummyStackRegisterGenerator.setUpForRegister(
//   dummyStackRegister,
// );

// @register
// class DummyStack {}

@StackRegister.register
class DummyStack1 {
  isInPath(path: string) {
    return true;
  }
}

@StackRegister.register
class DummyStack2 {
  isInPath(path: string) {
    return true;
  }
}

@StackRegister.registerRuleForStacks([DummyStack1, DummyStack2])
class DummyRule {
  rootPath = '';
  name() {
    return '';
  }
  description() {
    return '';
  }
  requiredFiles = [];
  shouldBeApplied() {
    return true;
  }
  apply() {
    //
  }
}

test('getImplementations() should return an array containing two class constructors', () => {
  expect(StackRegister.getImplementations().length).toEqual(2);
  expect(StackRegister.getImplementations()[0].name).toEqual('DummyStack1');
  expect(StackRegister.getImplementations()[1].name).toEqual('DummyStack2');
});

test('getRulesByStack(stackName) should return an array containing the DummyRule constructor', () => {
  const rulesArray1 = StackRegister.getRulesByStack('DummyStack1');
  const rulesArray2 = StackRegister.getRulesByStack('DummyStack2');

  expect(rulesArray1).toBeDefined();
  expect(rulesArray1.length).toEqual(1);
  expect(rulesArray1[0].name).toEqual('DummyRule');

  expect(rulesArray2).toBeDefined();
  expect(rulesArray2.length).toEqual(1);
  expect(rulesArray2[0].name).toEqual('DummyRule');
});
