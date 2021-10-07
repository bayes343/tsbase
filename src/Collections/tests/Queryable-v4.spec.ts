import { Queryable } from '../Queryable-v4';

describe('Queryable', () => {
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
});
