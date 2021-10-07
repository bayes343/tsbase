/* eslint-disable max-lines */
import { List } from '../List';
import { Queryable } from '../Queryable';
import { Errors } from '../../Errors';

describe('Queryable', () => {
  let classUnderTest: Queryable<any>;

  beforeEach(() => {
    classUnderTest = new List<any>();
  });

  it('should query for results WHERE a condition is met', () => {
    (classUnderTest as List<any>).AddRange([1, 2, 3, 4, 5]);
    const results = classUnderTest.Where(item => item > 2);
    expect(results.Item.length).toEqual(3);
    expect(classUnderTest.Item.length).toEqual(5);
  });

  it('should know if all items satisfy a condition', () => {
    (classUnderTest as List<any>).AddRange([
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
    (classUnderTest as List<any>).AddRange([
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

  it('should return the Queryable as a list', () => {
    (classUnderTest as List<any>).AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const newList = classUnderTest.Where(item => item.name === 'David');
    expect(newList.Any(item => item.name === 'David'));
  });

  it('should take a sequence of items', () => {
    (classUnderTest as List<any>).AddRange([
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
    (classUnderTest as List<any>).Clear();
    const emptyList = classUnderTest.TakeWhile(item => item.key.length >= 1);
    expect((emptyList as List<{ key: '', value: number }>).Count).toEqual(0);

    (classUnderTest as List<any>).AddRange([
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

  it('should return distinct elements from the Queryable collection', () => {
    (classUnderTest as List<any>).AddRange([
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
    (classUnderTest as List<any>).AddRange([
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
    (classUnderTest as List<any>).AddRange([
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
    (classUnderTest as List<any>).AddRange([1, 1, 2, 2, 2, 3]);
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
    (classUnderTest as List<any>).AddRange([1, 1, 2, 2, 2, 3]);
    const eleven = classUnderTest.Sum();
    expect(eleven).toEqual(11);
    const twentyTwo = classUnderTest.Sum(item => item * 2);
    expect(twentyTwo).toEqual(22);

    // error
    (classUnderTest as List<any>).Add('notanumber');
    expect(() => {
      classUnderTest.Sum();
    }).toThrowError(`${Errors.InvalidOperation} - Could not parse \'notanumber\' as a number`);
  });

  it('should average the value of elements as numbers or based on a given function', () => {
    (classUnderTest as List<any>).AddRange([2, 2, 2, 2, 2, 2]);
    const two = classUnderTest.Average();
    expect(two).toEqual(2);
    // Custom use case
    (classUnderTest as List<any>).Clear();
    (classUnderTest as List<any>).AddRange([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const averageLength = classUnderTest.Average(item => item.name.length);
    expect(averageLength).toEqual(5.25);

    // error
    (classUnderTest as List<any>).Clear();
    expect(() => {
      classUnderTest.Average();
    }).toThrowError(`${Errors.InvalidOperation} - Cannot calculate an average from a collection with no elements`);
  });

  // it('should get a random item from the collection', () => {
  //   (classUnderTest as List<any>).AddRange([2, 2, 2, 2, 2, 2]);
  //   const randomItem = classUnderTest.GetRandom();
  //   expect(randomItem).toBeDefined();
  // });

  it('should return a new collection with an item appended', () => {
    (classUnderTest as List<any>).AddRange([1, 2, 3, 4]);
    const appended = classUnderTest.Append(5);
    expect(appended.Item[4]).toEqual(5);
  });

  it('should return the first element in the sequence', () => {
    const nullEl = classUnderTest.First();
    expect(nullEl).toBeNull();
    (classUnderTest as List<any>).AddRange([1, 2, 3]);
    const first = classUnderTest.First();
    expect(first).toEqual(1);
  });

  it('should return the last element in the sequence', () => {
    const nullEl = classUnderTest.Last();
    expect(nullEl).toBeNull();
    (classUnderTest as List<any>).AddRange([1, 2, 3]);
    const last = classUnderTest.Last();
    expect(last).toEqual(3);
  });

  it('should evaluate if an item is contained within a collection', () => {
    (classUnderTest as List<any>).AddRange(['1', '2', '3']);
    const truthy = classUnderTest.Contains('1');
    const falsy = classUnderTest.Contains('4');
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();

    // complex object
    classUnderTest = new List<{ name: string, description: string }>();
    const testObject = { name: 'Joey', description: 'Developer of this library' };
    (classUnderTest as List<any>).Add(testObject);
    const truthy2 = classUnderTest.Contains(testObject);
    const falsy2 = classUnderTest.Contains({ name: 'Fake', description: 'does not exist' });
    expect(truthy2).toBeTruthy();
    expect(falsy2).toBeFalsy();
  });

  it('should return a new collection with an item prepended to the beginning of the sequence', () => {
    (classUnderTest as List<any>).AddRange([1, 2, 3, 4]);
    const prependedCollection = classUnderTest.Prepend(0);
    expect(prependedCollection.Item.length).toEqual(5);
    expect(prependedCollection.Item[0]).toEqual(0);
  });

  // it('should get a random element excluding a given set', () => {
  //   (classUnderTest as List<any>).AddRange([2, 4, 8, 15, 23, 42]);
  //   const random = classUnderTest.GetRandom([2, 4, 8, 15, 23]);
  //   expect(random).toEqual(42);
  //   const randomNull = classUnderTest.GetRandom([2, 4, 8, 15, 23, 42]);
  //   expect(randomNull).toBeNull();
  // });

  it('should find the item with the minimum result from the defined function or default comparer', () => {
    const array = [3, 6, 1, 8, 3, 9, 3, 10];
    expect(Queryable.From(array).Min()).toEqual(1);

    const arrayOfObjects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(Queryable.From(arrayOfObjects).Min(o => o.id).id).toEqual(1);

    expect(() => {
      Queryable.From([]).Min();
    }).toThrowError(`${Errors.InvalidOperation} - you cannot use the Min() function on an empty collection.`);
  });

  it('should find the item with the maximum result from the defined function or default comparer', () => {
    const array = [3, 6, 1, 8, 3, 9, 3, 10];
    expect(Queryable.From(array).Max()).toEqual(10);

    const arrayOfObjects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(Queryable.From(arrayOfObjects).Max(o => o.id).id).toEqual(3);

    expect(() => {
      Queryable.From([]).Max();
    }).toThrowError(`${Errors.InvalidOperation} - you cannot use the Max() function on an empty collection.`);
  });

  const dataToSearch: Array<{ name: string, age: number, gender: 'male' | 'female' }> = [
    { name: 'John Doe', age: 18, gender: 'male' },
    { name: 'Johnny Boy', age: 20, gender: 'male' },
    { name: 'Johnson Connor', age: 22, gender: 'male' },
    { name: 'Jane Doe', age: 18, gender: 'female' },
    { name: 'Jenny Girl', age: 19, gender: 'female' }
  ];

  it('should search a collection of objects by search term', () => {
    const johnDoeSearch = Queryable.From(dataToSearch).Search('John Doe');
    const john = johnDoeSearch.First();

    expect(john !== null && john.name === 'John Doe').toBeTruthy();
    expect(johnDoeSearch.Item.length).toEqual(4);
  });

  it('should search and return an empty collection when no results are found', () => {
    const badSearch = Queryable.From(dataToSearch).Search('Super Fake');
    expect(badSearch.Item.length).toEqual(0);
  });

  it('should search a collection with custom keyword length', () => {
    const ageSearch = Queryable.From(dataToSearch).Search('18', 2);
    const failedDoeSearch = Queryable.From(dataToSearch).Search('So Doe', 4);

    expect(ageSearch.Item.length).toEqual(2);
    expect(failedDoeSearch.Item.length).toEqual(0);
  });

  it('should search a collection with stop words', () => {
    const stopWords = ['female'];
    const allMalesSearch = Queryable.From(dataToSearch).Search('female');
    const johnBoyMaleSearch = Queryable.From(dataToSearch).Search('girl female', 3, stopWords);

    expect(allMalesSearch.Item.length).toEqual(2);
    expect(johnBoyMaleSearch.Item.length).toEqual(1);
  });

  it('should search a collection using ignorable suffix characters', () => {
    const words = ['toy'];
    const ignorableChars = ['s'];

    const toysSearch = Queryable.From(words).Search('toys', 3, [], ignorableChars);

    expect(toysSearch.First()).toEqual('toy');
  });

  it('should retrieve the first element satisfying a given predicate', () => {
    const words = ['one', 'two', 'three', 'four'];
    const firstGreaterThanThreeLengthWord = Queryable.From(words).First(w => w.length > 3);
    expect(firstGreaterThanThreeLengthWord).toEqual('three');
  });

  it('should retrieve the last element satisfying a given predicate', () => {
    const words = ['one', 'two', 'three', 'four'];
    const firstGreaterThanThreeLengthWord = Queryable.From(words).Last(w => w.length > 3);
    expect(firstGreaterThanThreeLengthWord).toEqual('four');
  });
});
