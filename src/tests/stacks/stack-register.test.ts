import { StackRegister } from '../../stacks/stack-register';

@StackRegister.register
class DummyStack {
  // Here DummyStack should implement Stack interface but I would like to make a mock of Stack interface so I don't
  // have to implement Stack methods in my tests
}

test('getImplementations() should return an array containing two class constructors', () => {
  const dummyStack = new DummyStack();

  expect(StackRegister.getImplementations().length).toEqual(1);
});
