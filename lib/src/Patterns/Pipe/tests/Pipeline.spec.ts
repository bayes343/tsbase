import { Pipeline } from '../Pipeline';
import { IPipe } from '../IPipe';

class LowerCasePipe implements IPipe<string> {
  Transform(object: string): string {
    return object.toLowerCase();
  }
}

class UpperCasePipe implements IPipe<string> {
  Transform(object: string): string {
    return object.toUpperCase();
  }
}

describe('Pipeline', () => {
  let classUnderTest: Pipeline<string>;

  beforeEach(() => {
    classUnderTest = new Pipeline<string>([
      new LowerCasePipe(),
      new UpperCasePipe()
    ]);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should transform based on the given pipes', () => {
    expect(classUnderTest.Transform('oNe')).toEqual('ONE');
  });
});
