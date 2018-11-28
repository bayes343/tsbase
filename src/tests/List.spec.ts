describe('Comment', () => {
  let classUnderTest: Collections.List<any>;

  beforeEach(() => {
    classUnderTest = new Collections.List<string>();
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
    classUnderTest = new Collections.List<{ name: string, description: string }>();
    const testObject = { name: 'Joey', description: 'Developer of this library' };
    classUnderTest.Add(testObject);
    const truthy2 = classUnderTest.Contains(testObject);
    const falsy2 = classUnderTest.Contains({ name: 'Fake', description: 'does not exist' });
    expect(truthy2).toBeTruthy();
    expect(falsy2).toBeFalsy();
  });

});

