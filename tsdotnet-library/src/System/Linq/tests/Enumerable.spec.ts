import { List } from '../../Collections/Generic/List';

describe('Enumerable', () => {
  let classUnderTest: List<any>;

  beforeEach(() => {
    classUnderTest = new List<string>();
  });

  it('should query for results WHERE a condition is met', () => {
    classUnderTest.AddRange([1, 2, 3, 4, 5]);
    const results = classUnderTest.Where(item => item > 2);
    expect(results.Item.length).toEqual(3);
    expect(classUnderTest.Count).toEqual(5);
  });

  it('should orderby a predicate or the default comparer', () => {
    classUnderTest.AddRange([4, 5, 1, 3, 1]);
    const results = classUnderTest.OrderBy();
    expect(results.Item[0]).toEqual(1);
    expect(results.Item[4]).toEqual(5);

    classUnderTest.Clear();
    classUnderTest.AddRange(['4', '5', '1', '3', '1']);
    const resultsPredicate = classUnderTest.OrderBy(item => parseInt(item));
    expect(resultsPredicate.Item[0]).toEqual('1');
    expect(resultsPredicate.Item[4]).toEqual('5');
  });

  it('should orderby descending by a predicate or the default comparer', () => {
    classUnderTest.AddRange([4, 5, 1, 3, 1]);
    const results = classUnderTest.OrderByDescending();
    expect(results.Item[0]).toEqual(5);
    expect(results.Item[4]).toEqual(1);

    classUnderTest.Clear();
    classUnderTest.AddRange(['4', '5', '1', '3', '1']);
    const resultsPredicate = classUnderTest.OrderByDescending(item => parseInt(item));
    expect(resultsPredicate.Item[0]).toEqual('5');
    expect(resultsPredicate.Item[4]).toEqual('1');
  });

  it('should find results where a condition is met and return them based on a user defined sort', () => {
    classUnderTest.AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const query = classUnderTest
      .Where(item => item.name.length >= 3)
      .OrderBy(item => item.name) as List<{ name: string }>;
    expect(query.Item[0].name).toEqual('Adam');
    expect(query.Item[3].name).toEqual('David');
  });

  it('should know if all items satisfy a condition', () => {
    classUnderTest.AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const truthy = classUnderTest.All(item => item.name.length > 1);
    const falsy = classUnderTest.All(item => item.name === 'Billy');
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();
  });

  it('should know if any items satisfy a condition', () => {
    classUnderTest.AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const truthy = classUnderTest.Any(item => item.name === 'Billy');
    const falsy = classUnderTest.Any(item => item.name.length > 15);
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();
  });

  it('should return the enumerable as a list', () => {
    classUnderTest.AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const newList = classUnderTest.Where(item => item.name === 'David').ToList();
    expect(newList.Exists(item => item.name === 'David'));
  });

  it('should take a sequence of items', () => {
    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '2', value: 2 },
      { key: '3', value: 3 },
      { key: '4', value: 4 },
      { key: '5', value: 5 },
      { key: '6', value: 6 },
      { key: '7', value: 7 }
    ]);
    const first3 = classUnderTest.Take(3);
    expect((first3 as List<{ key: string, value: number }>).Count).toEqual(3);
  });

  it('should take the last item in the sequence', () => {
    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '2', value: 2 },
      { key: '3', value: 3 },
      { key: '4', value: 4 },
      { key: '5', value: 5 },
      { key: '6', value: 6 },
      { key: '7', value: 7 }
    ]);
    const lastOf3 = classUnderTest.TakeLast(3);
    expect(lastOf3.Item[0]).toEqual({ key: '3', value: 3 });
  });

  it('should take items while a condition is met', () => {
    classUnderTest.Clear();
    const emptyList = classUnderTest.TakeWhile(item => item.key.length >= 1);
    expect((emptyList as List<{ key: '', value: number }>).Count).toEqual(0);

    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '2', value: 2 },
      { key: '3', value: 3 },
      { key: '4', value: 4 },
      { key: '5', value: 5 },
      { key: '6', value: 6 },
      { key: '7', value: 7 }
    ]);

    const noMatches = classUnderTest.TakeWhile(item => item.value < 1);
    expect((noMatches as List<{ key: string, value: number }>).Count).toEqual(0);

    const first4 = classUnderTest.TakeWhile(item => item.value < 5);
    expect((first4 as List<{ key: string, value: number }>).Count).toEqual(4);
  });

});

