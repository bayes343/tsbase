describe('Comment', () => {
  let classUnderTest: Collections.List<any>;

  beforeEach(() => {
    classUnderTest = new Collections.List<string>();
  });

  it('should construct with no params', () => {
    expect(classUnderTest).toBeDefined();
  });
});

