import List = Collections.List;

describe('List', () => {
  let classUnderTest: List<any>;

  beforeEach(() => {
    classUnderTest = new List<string>();
  });

  it('should construct with no params', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should be constructed with a parameter array', () => {
    classUnderTest = new List<number>([1, 2, 3]);
    expect(classUnderTest.Count).toEqual(3);
  });

  it('should add objects to the collection', () => {
    classUnderTest.Add('String1');
    classUnderTest.Add('String2');
    classUnderTest.Add('String3');
    expect(classUnderTest.Count).toEqual(3);
  });

  it('should add a range of objects to the collection', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    expect(classUnderTest.Count).toEqual(3);
  });

  it('should clear the collection', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.Clear();
    expect(classUnderTest.Count).toEqual(0);
  });

  it('should evaluate if an item is contained within a collection', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    const truthy = classUnderTest.Contains('1');
    const falsy = classUnderTest.Contains('4');
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();

    // complex object
    classUnderTest = new List<{ name: string, description: string }>();
    const testObject = { name: 'Joey', description: 'Developer of this library' };
    classUnderTest.Add(testObject);
    const truthy2 = classUnderTest.Contains(testObject);
    const falsy2 = classUnderTest.Contains({ name: 'Fake', description: 'does not exist' });
    expect(truthy2).toBeTruthy();
    expect(falsy2).toBeFalsy();
  });

  it('should copy contained elements to an array', () => {
    const fullCopy: Array<string> = [];
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.CopyTo(fullCopy);
    expect(fullCopy.length).toEqual(3);

    const firstElement: Array<string> = [];
    classUnderTest.CopyTo(firstElement, 0, 1);
    expect(firstElement.length).toEqual(1);

    const lastTwoElements: Array<string> = [];
    classUnderTest.CopyTo(lastTwoElements, 1);
    expect(lastTwoElements.length).toEqual(2);
  });

  it('should evaluate if an element exists based on the predicate passed', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    const truthy = classUnderTest.Exists(item => item === '3');
    expect(truthy).toBeTruthy();
    const falsy = classUnderTest.Exists(item => item === '5');
    expect(falsy).toBeFalsy();
  });

  it('should find an element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    const match = classUnderTest.Find(item => item === '3');
    expect(match).toBeTruthy();

    const noMatch = classUnderTest.Find(item => item === '5');
    expect(noMatch).toBeFalsy();
  });

  it('should find all / return all elements that match a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const threeElements = classUnderTest.FindAll(item => item.length === 1);
    expect(threeElements.Count).toEqual(3);
  });

  it('should find the index of the first element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const zero = classUnderTest.FindIndex(item => item === '1');
    expect(zero).toEqual(0);

    // start index
    const two = classUnderTest.FindIndex(item => item.length === 1, 2);
    expect(two).toEqual(2);

    // end range
    const three = classUnderTest.FindIndex(item => item.length >= 2, 2, classUnderTest.Count);
    expect(three).toEqual(3);

    const notFound = classUnderTest.FindIndex(item => item === '0');
    expect(notFound).toEqual(-1);
  });

  it('should find the last element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    const match = classUnderTest.FindLast(item => item.length === 1);
    expect(match).toEqual('3')

    const noMatch = classUnderTest.FindLast(item => item === '5');
    expect(noMatch).toBeFalsy();
  });

  it('should find the last index of the first element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const zero = classUnderTest.FindLastIndex(item => item.length === 1);
    expect(zero).toEqual(2);

    // start index
    const two = classUnderTest.FindLastIndex(item => item.length === 1, 2);
    expect(two).toEqual(2);

    // // end range
    const three = classUnderTest.FindLastIndex(item => item.length >= 1, 0, classUnderTest.Count - 1);
    expect(three).toEqual(3);

    const notFound = classUnderTest.FindLastIndex(item => item === '0');
    expect(notFound).toEqual(-1);
  });

  it('should apply an action foreach element in the list', () => {
    // external scope
    let counter = 0;
    classUnderTest.AddRange(['1', '2', '3', '21']);
    classUnderTest.ForEach(item => {
      counter++
    });
    expect(counter).toEqual(4);

    // internal scope
    let currentValue = '';
    classUnderTest.ForEach(item => {
      currentValue = item;
    });
    expect(currentValue).toEqual('21');
  });
});

