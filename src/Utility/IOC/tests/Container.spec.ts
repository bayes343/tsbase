import { IContainer } from '../IContainer';
import { Container } from '../Container';

type Dependencies = {
  number: number,
  string: String,
  array: Array<any>
};

describe('Container', () => {
  const classUnderTest: IContainer<Dependencies> = new Container();

  it('should throw an error when get is called before init', () => {
    expect(() => {
      classUnderTest.Get(d => d.number);
    }).toThrowError('IOC container not yet initialized. Call Init() before Get().');
  });

  it('should init dependencies', () => {
    classUnderTest.Init({
      number: 0,
      string: new String('test'),
      array: new Array(1, 2)
    });

    expect((classUnderTest as Container<Dependencies>)['dependencies']).not.toBeNull();
  });

  it('should resolve dependencies via type safe lambda syntax', () => {
    expect(classUnderTest.Get(d => d.number)).toEqual(0);
    expect(classUnderTest.Get(d => d.string)).toEqual('test');
    expect(classUnderTest.Get(d => d.array).length).toEqual(2);
  });
});
