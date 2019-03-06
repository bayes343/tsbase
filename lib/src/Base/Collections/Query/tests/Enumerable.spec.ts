import { List } from '../../List';

describe('Enumerable', () => {
  let classUnderTest: List<any>;

  beforeEach(() => {
    classUnderTest = new List<any>();
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
    const resultsPredicate = classUnderTest.OrderBy([item => parseInt(item)]);
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
    const resultsPredicate = classUnderTest.OrderByDescending([item => parseInt(item)]);
    expect(resultsPredicate.Item[0]).toEqual('5');
    expect(resultsPredicate.Item[4]).toEqual('1');
  });

  it('should orderby many funcs by descending precedence', () => {
    // ascending
    classUnderTest.AddRange([
      { lastName: 'A', firstName: 'Z', age: 18 },
      { lastName: 'A', firstName: 'Y', age: 24 },
      { lastName: 'C', firstName: 'X', age: 19 },
      { lastName: 'C', firstName: 'W', age: 26 },
      { lastName: 'E', firstName: 'V', age: 32 }
    ]);
    const lastFirstAge = classUnderTest.OrderBy([
      item => item.lastName,
      item => item.firstName,
      item => item.age
    ]);
    expect(lastFirstAge.Item[0].age).toEqual(24);

    // descending
    const ageFirstLast = classUnderTest.OrderByDescending([
      item => item.age,
      item => item.firstName,
      item => item.lastName
    ]);
    expect(ageFirstLast.Item[0].age).toEqual(32);
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
      .OrderBy([item => item.name]).ToList();
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

  it('should return distinct elements from the enumerable collection', () => {
    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '1', value: 1 },
      { key: '1', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 3 }
    ]);
    const distinctElements = classUnderTest.Distinct();
    expect((distinctElements as List<{ key: '2', value: 3 }>).Count).toEqual(4);
  });

  it('should skip a sequence of items and return the rest', () => {
    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '1', value: 1 },
      { key: '1', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 3 }
    ]);
    const last3 = classUnderTest.Skip(3);
    expect((last3 as List<{ key: string, value: number }>).Count).toEqual(3);
  });

  it('should skip items while a condition is true then return the rest', () => {
    classUnderTest.AddRange([
      { key: '1', value: 1 },
      { key: '1', value: 1 },
      { key: '1', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 3 }
    ]);
    const oneItem = classUnderTest.SkipWhile(item => item.value < 3);
    expect((oneItem as List<{ key: string, value: number }>).Count).toEqual(1);
  });

  it('should aggregate the elements based on input parameter accumulator and result functions', () => {
    // custom aggregation
    classUnderTest.AddRange([1, 1, 2, 2, 2, 3]);
    const three = classUnderTest.Aggregate(
      1,
      (largest, next) => largest > next ? largest : next,
      item => item.toString()
    );
    expect(three).toEqual('3');

    // simple aggregation
    const eleven = classUnderTest.Aggregate(
      0,
      (current, next) => current + next,
      item => item.toString()
    );
    expect(eleven).toEqual('11');
  });

  it('should sum the value of elements as numbers or based on a given function', () => {
    classUnderTest.AddRange([1, 1, 2, 2, 2, 3]);
    const eleven = classUnderTest.Sum();
    expect(eleven).toEqual(11);
    const twentyTwo = classUnderTest.Sum(item => item * 2);
    expect(twentyTwo).toEqual(22);

    // error
    classUnderTest.Add('notanumber');
    expect(() => {
      classUnderTest.Sum();
    }).toThrowError('Could not parse \'notanumber\' as a number');
  });

  it('should average the value of elements as numbers or based on a given function', () => {
    classUnderTest.AddRange([2, 2, 2, 2, 2, 2]);
    const two = classUnderTest.Average();
    expect(two).toEqual(2);
    // Custom use case
    classUnderTest.Clear()
    classUnderTest.AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const averageLength = classUnderTest.Average(item => item.name.length);
    expect(averageLength).toEqual(5.25);

    // error
    classUnderTest.Clear();
    expect(() => {
      classUnderTest.Average();
    }).toThrowError('Cannot calculate an average from a collection with no elements');
  });

  it('should get a random item from the collection', () => {
    classUnderTest.AddRange([2, 2, 2, 2, 2, 2]);
    const randomItem = classUnderTest.GetRandom();
    expect(randomItem).toBeDefined();
  });

  it('should return a new collection with an item appended', () => {
    classUnderTest.AddRange([1, 2, 3, 4]);
    const appended = classUnderTest.Append(5);
    expect(appended.Item[4]).toEqual(5);
  });

  it('should return a new collection Except for the items passed', () => {
    classUnderTest.AddRange([1, 2, 3, 4]);
    const diff = classUnderTest.Except([2, 3]);
    expect(diff.Item.length).toEqual(2);
    expect(diff.Item[0]).toEqual(1);
  });

});
