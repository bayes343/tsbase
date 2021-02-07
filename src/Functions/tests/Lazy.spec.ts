import { Lazy } from '../Lazy';

describe('Lazy', () => {
  const lazyObject = Lazy(Object);

  it('should return a function that retrieves the managed instance of a object', () => {
    expect(lazyObject()).toBeDefined();
  });

  it('should return the same instance no matter how many times it is invoked', () => {
    const lazyObjectFunction = Lazy(Object);
    const one = lazyObjectFunction();
    const two = lazyObjectFunction();
    const three = lazyObjectFunction();

    expect(one).toBe(two);
    expect(two).toBe(three);
  });

  it('should return the same instance of a complex object', () => {
    const name = 'fake test';
    const subject = 'subject';
    const questions = ['what is your name?'];
    class Test { name: string = ''; subject: string = ''; questions = new Array<string>(); }
    const lazyTest = Lazy(Test);

    lazyTest().name = name;
    lazyTest().subject = subject;
    expect(lazyTest().name).toEqual(name);
    expect(lazyTest().subject).toEqual(subject);

    lazyTest().questions = questions;
    expect(lazyTest().name).toEqual(name);
    expect(lazyTest().subject).toEqual(subject);
    expect(lazyTest().questions).toEqual(questions);
  });
});
