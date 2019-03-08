import { SortedList } from "../SortedList";

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

});

