describe('List', () => {
  let classUnderTest: List<any>;

  beforeEach(() => {
    classUnderTest = new List<string>();
  });

  it('should construct with no params', () => {
    expect(classUnderTest).toBeDefined();
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
});

