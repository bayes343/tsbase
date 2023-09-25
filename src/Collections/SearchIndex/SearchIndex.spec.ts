import { ISearchIndex, Indexer, SearchIndex } from './module';

type Name = {
  given: string;
  middle: string;
  surname: string;
}

describe('SearchIndex', () => {
  const classUnderTest: ISearchIndex<Name> = new SearchIndex();
  const data = [
    {
      given: 'John',
      middle: 'Dee',
      surname: 'Doe'
    },
    {
      given: 'Jane',
      middle: 'Daa',
      surname: 'Doe'
    },
    {
      given: 'Jack',
      middle: 'Doo',
      surname: 'Diddly'
    }
  ];
  const indexer: Indexer<Name, Name> = (d: Name) => [
    [`${d.given} ${d.middle} ${d.surname}`, {
      item: d,
      qualifier: () => true
    }],
    [`${d.given} ${d.middle.slice(0, 1)}. ${d.surname}`, {
      item: d,
      qualifier: () => true
    }],
    [`${d.given.slice(0, 1)}${d.middle.slice(0, 1)}${d.surname.slice(0, 1)}`, {
      item: d,
      qualifier: () => true
    }],
    [`What is ${d.given} ${d.surname}'s middle name?`, {
      item: d,
      qualifier: () => true
    }]
  ];

  beforeEach(() => {
    classUnderTest.Reset();
  });

  it('search should return one result for the query "John" given available data', async () => {
    await classUnderTest.Insert(data, indexer);
    const results = await classUnderTest.Search('John');
    expect(results.length).toEqual(1);
  });

  it('search should return two results for the query "Doe" given available data', async () => {
    await classUnderTest.Insert(data, indexer);
    const results = await classUnderTest.Search('Doe');
    expect(results.length).toEqual(2);
  });

  it('search should return three results for the query "JDD" given available data', async () => {
    await classUnderTest.Insert(data, indexer);
    const results = await classUnderTest.Search('JDD');
    expect(results.length).toEqual(3);
  });

  it('search should return results in order of specificity', async () => {
    await classUnderTest.Insert(data, indexer);

    let results = await classUnderTest.Search('What is John Doe\'s middle name?');
    expect(results[0]).toEqual({
      given: 'John',
      middle: 'Dee',
      surname: 'Doe'
    });

    results = await classUnderTest.Search('What is the middle name of John Doe?');
    expect(results[0]).toEqual({
      given: 'John',
      middle: 'Dee',
      surname: 'Doe'
    });
  });

  it('search should return results based on indexer and qualifier functions', async () => {
    const answerIndex = new SearchIndex<() => string>();
    await answerIndex.Insert(data, (d) => [
      [`What is ${d.given} ${d.surname}'s middle name?`, {
        item: () => d.middle,
        qualifier: (q) =>
          [d.given, d.surname].some(s => q.includes(s)) &&
          ![d.middle, 'last name'].some(s => q.includes(s))
      }],
      [`Who has the last name "${d.surname}"?`, {
        item: () => `${d.given} ${d.surname}`,
        qualifier: (q) =>
          [d.surname.toLowerCase(), 'who'].every(s => q.toLowerCase().includes(s))
      }]
    ]);

    const joesMiddleNameResults = await answerIndex.Answer('What is John\'s middle name?');
    expect(joesMiddleNameResults?.()).toEqual('Dee');

    const lastNameDoeResults = await answerIndex.Search('Who has the last name Doe?');
    expect(lastNameDoeResults.map(r => r())).toEqual([
      'John Doe',
      'Jane Doe'
    ]);
  });
});
