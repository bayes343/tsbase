/* eslint-disable max-lines */
import { Queryable } from '../Queryable';

describe('Queryable', () => {
  it('should construct with protected constructor', () => {
    class TestQueryable<T> extends Queryable<T> {
      constructor() {
        super();
      }
    }
    expect(new TestQueryable<any>()).toBeDefined();
  });

  it('should construct with factory method', () => {
    const q = Queryable.From([1, 2, 3]);

    expect(q).toBeDefined();
    expect(q.length).toEqual(3);
  });

  it('should return elements of the set except members of the given set', () => {
    const oddNumbers = Queryable.From([1, 2, 3, 4, 5]).Except([2, 4]);

    expect([2, 4].some(i => oddNumbers.includes(i))).toBeFalsy();
    expect([1, 3, 5].every(i => oddNumbers.includes(i))).toBeTruthy();
  });

  it('should shuffle items', () => {
    const q = Queryable.From([1, 2, 3, 4, 5, 6]);

    const shuffled = q.Shuffle();

    const itemsShuffled = (q: Queryable<number>) =>
      q[0] !== 1 ||
      q[1] !== 2 ||
      q[2] !== 3 ||
      q[3] !== 4 ||
      q[4] !== 5 ||
      q[5] !== 6;
    expect(itemsShuffled(q)).toBeFalsy();
    expect(itemsShuffled(shuffled)).toBeTruthy();
  });

  it('should get a random item from the collection', () => {
    const q = Queryable.From([2, 2, 2, 2, 2, 2]); // randomization tested with shuffle method
    expect(q.GetRandom()).toBeDefined();
  });

  it('should get a random element excluding a given set', () => {
    const q = Queryable.From([2, 4, 8, 15, 23, 42]);
    const random = q.GetRandom([2, 4, 8, 15, 23]);
    expect(random).toEqual(42);

    const randomNull = q.GetRandom([2, 4, 8, 15, 23, 42]);
    expect(randomNull).toBeNull();
  });

  it('should return the first element in the sequence', () => {
    const nullEl = Queryable.From([]).First();
    expect(nullEl).toBeNull();

    const q = Queryable.From([1, 2, 3]);
    const first = q.First();
    expect(first).toEqual(1);
  });

  it('should return the last element in the sequence', () => {
    const nullEl = Queryable.From([]).Last();
    expect(nullEl).toBeNull();

    const q = Queryable.From([1, 2, 3]);
    const last = q.Last();
    expect(last).toEqual(3);
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

  it('should order by default sort', () => {
    const ordered = Queryable.From([5, 4, 3, 2, 1]).OrderBy();
    expect(ordered[0]).toEqual(1);
  });

  it('should order by descending default sort', () => {
    const ordered = Queryable.From([1, 2, 3, 4, 5]).OrderByDescending();
    expect(ordered[0]).toEqual(5);
  });

  it('should order by even elements then value', () => {
    const ordered = Queryable.From([5, 4, 3, 2, 1]).OrderBy([
      i => i % 2 === 0 ? 0 : 1,
      i => i
    ]);
    expect(ordered[0]).toEqual(2);
  });

  it('should order by strings', () => {
    const ordered = Queryable.From(['zebra', 'apple', 'c', 'b', 'f', 'e']).OrderBy([
      i => i
    ]);

    expect(ordered[0]).toEqual('apple');
    expect(ordered[5]).toEqual('zebra');
  });

  it('should order by strings on objects', () => {
    const ordered = Queryable.From([
      { value: 'zebra' },
      { value: 'apple' },
      { value: 'c' },
      { value: 'b' },
      { value: 'f' },
      { value: 'e' }
    ]).OrderBy([
      i => i.value
    ]);

    expect(ordered[0]).toEqual({ value: 'apple' });
    expect(ordered[5]).toEqual({ value: 'zebra' });
  });

  it('should find the item with the minimum result from the defined function or default comparer', () => {
    const array = [3, 6, 1, 8, 3, 9, 3, 10];
    expect(Queryable.From(array).Min()).toEqual(1);

    const arrayOfObjects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(Queryable.From(arrayOfObjects).Min(o => o.id)?.id).toEqual(1);

    expect(Queryable.From([]).Min()).toBeNull();
  });

  it('should find the item with the maximum result from the defined function or default comparer', () => {
    const array = [3, 6, 1, 8, 3, 9, 3, 10];
    expect(Queryable.From(array).Max()).toEqual(10);

    const arrayOfObjects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(Queryable.From(arrayOfObjects).Max(o => o.id)?.id).toEqual(3);

    expect(Queryable.From([]).Max()).toBeNull();
  });

  it('should sum the value of elements as numbers or based on a given function', () => {
    let q = Queryable.From([1, 1, 2, 2, 2, 3]);
    const eleven = q.Sum();
    expect(eleven).toEqual(11);

    const twentyTwo = q.Sum(item => item * 2);
    expect(twentyTwo).toEqual(22);

    // error
    q = Queryable.From(q.concat(['notanumber' as unknown as number]));
    expect(q.Sum()).toBeNull();
  });

  it('should average the value of elements as numbers or based on a given function', () => {
    let q: Queryable<any> = Queryable.From([2, 2, 2, 2, 2, 2]);
    const two = q.Average();
    expect(two).toEqual(2);

    // Custom use case
    q = Queryable.From([
      { name: 'Billy' },
      { name: 'Adam' },
      { name: 'David' },
      { name: 'Charley' }
    ]);
    const averageLength = q.Average(item => item.name.length);
    expect(averageLength).toEqual(5.25);

    // null response
    q = Queryable.From([]);
    expect(q.Average()).toBeNull();
  });


  it('should return distinct elements from the Queryable collection', () => {
    const q = Queryable.From([
      { key: '1', value: 1 },
      { key: '1', value: 1 },
      { key: '1', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 2 },
      { key: '2', value: 3 }
    ]);

    const distinctElements = q.Distinct();

    expect(distinctElements.length).toEqual(4);
  });


  const dataToSearch: Array<{ name: string, age: number, gender: 'male' | 'female' }> = [
    { name: 'John Doe', age: 18, gender: 'male' },
    { name: 'Johnny Boy', age: 20, gender: 'male' },
    { name: 'Johnson Connor', age: 22, gender: 'male' },
    { name: 'Jane Doe', age: 18, gender: 'female' },
    { name: 'Jenny Girl', age: 19, gender: 'female' }
  ];

  it('should search and return an empty collection when no results are found', () => {
    const badSearch = Queryable.From(dataToSearch).Search('Super Fake');
    expect(badSearch.length).toEqual(0);
  });

  it('should search a collection with custom keyword length', () => {
    const ageSearch = Queryable.From(dataToSearch).Search('18', 2);
    const failedDoeSearch = Queryable.From(dataToSearch).Search('So Doe', 4);

    expect(ageSearch.length).toEqual(2);
    expect(failedDoeSearch.length).toEqual(0);
  });

  it('should search a collection with stop words', () => {
    const stopWords = ['female'];
    const allMalesSearch = Queryable.From(dataToSearch).Search('female');
    const johnBoyMaleSearch = Queryable.From(dataToSearch).Search('girl female', 3, stopWords);

    expect(allMalesSearch.length).toEqual(2);
    expect(johnBoyMaleSearch.length).toEqual(1);
  });
});
