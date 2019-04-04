import { SortedList } from "../SortedList";
import { Errors } from '../../Errors';

describe('SortedList', () => {
  let classUnderTest: SortedList<any>;

  beforeEach(() => {
    classUnderTest = new SortedList<string>(['d', 'e', 'f']);
  });

  it('when the collection is modified it should remain sorted by the default comparer', () => {
    classUnderTest.AddRange(['a', 'b', 'c']);
    expect(classUnderTest.Item[0]).toEqual('a');
    expect(classUnderTest.Item[classUnderTest.Count - 1]).toEqual('f');
  });

  it('when the collection is modified it should remain sorted by the given sorting function', () => {
    classUnderTest = new SortedList<{ name: string, age: number }>([
      { name: 'bob', age: 50 },
      { name: 'charly', age: 20 }
    ], item => item.name);
    classUnderTest.Add({ name: 'abe', age: 80 });
    expect(classUnderTest.Item[0].name).toEqual('abe');
  });

  it('should remain sorted when the underlying data structure is modified', () => {
    classUnderTest.AddRange(['a', 'b', 'c']);
    classUnderTest.Item.push('a');
    expect(classUnderTest.Where(item => item === 'a').Item.length).toEqual(2);
    expect(classUnderTest.Item[0] === 'a' && classUnderTest.Item[1] === 'a').toBeTruthy();
    classUnderTest.Item = ['d', 'c', 'b'];
    expect(classUnderTest.Item[0]).toEqual('b');
  });

  it('should throw error when reverse is attempted', () => {
    expect(() => {
      classUnderTest.Reverse();
    }).toThrowError(`${Errors.InvalidOperation} - You cannot reverse a SortedList`);
  });

  it('should throw error when reverse range is attempted', () => {
    expect(() => {
      classUnderTest.ReverseRange();
    }).toThrowError(`${Errors.InvalidOperation} - You cannot reverse a range in a SortedList`);
  });

  it('should throw error when shuffle is attempted', () => {
    expect(() => {
      classUnderTest.Shuffle();
    }).toThrowError(`${Errors.InvalidOperation} - You cannot shuffle a SortedList`);
  });

});

