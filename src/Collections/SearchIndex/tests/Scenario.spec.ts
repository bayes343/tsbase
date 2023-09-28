import { Indexer } from '../ISearchIndex';
import { SearchIndex } from '../SearchIndex';

class Bot {
  static Unknown = 'Sorry, I\'m not sure about that one...';

  constructor(
    private index = new SearchIndex<() => string>()
  ) { }

  Program = async <T>(questionConfiguration: Indexer<T, () => string>, data?: T[]): Promise<void> => {
    await this.index.Insert(questionConfiguration, data);
  };

  Answer = async (question: string): Promise<string> => {
    const answerFunc = await this.index.Answer(question);
    return answerFunc?.() || Bot.Unknown;
  };
}

describe('Bot', () => {
  const bot = new Bot();

  beforeAll(() => {
    bot.Program(() => [
      ['What year is it?', {
        item: () => `The year is ${new Date().getFullYear().toString()}`,
        qualifier: (q) => ['what', 'year', 'is', 'it'].every(s => q.toLowerCase().toString().includes(s))
      }],
      ['What year did WW2 start?', {
        item: () => 'WW2 broke out in 1939',
        qualifier: (q) => ['what', 'year', 'ww2', 'start'].every(s => q.toLowerCase().includes(s))
      }]
    ]);

    bot.Program((d) => [
      [`How old is ${d.firstName} ${d.surname}?`, {
        item: () => (Math.round((new Date(2023, 8, 25).getTime() - d.birthDate.getTime()) / 1000 / 60 / 60 / 24 / 365)).toString(),
        qualifier: (q) => ['how', 'old'].every(s => q.toLowerCase().includes(s)) &&
          [d.firstName.toLowerCase(), d.surname.toLowerCase()].some(s => q.toLowerCase().includes(s))
      }],
      [`What is ${d.firstName}'s last name?`, {
        item: () => d.surname,
        qualifier: (q) => [d.firstName.toLowerCase(), 'what', 'is'].every(s => q.toLowerCase().includes(s)) &&
          ['last name', 'surname'].some(s => q.toLowerCase().includes(s))
      }]
    ], [
      {
        firstName: 'John',
        surname: 'Doe',
        birthDate: new Date(1990, 8, 5)
      },
      {
        firstName: 'Jane',
        surname: 'Dee',
        birthDate: new Date(1992, 3, 15)
      }
    ]);
  });

  it('should know what year it is', async () => {
    const answer = await bot.Answer('What year is it?');
    expect(answer).toEqual(`The year is ${new Date().getFullYear().toString()}`);
  });

  it('should know what year WW2 started', async () => {
    const answer = await bot.Answer('What year did WW2 start in?');
    expect(answer).toEqual('WW2 broke out in 1939');
  });

  it('should not know how WW2 started?', async () => {
    const answer = await bot.Answer('How did WW2 start?');
    expect(answer).toEqual(Bot.Unknown);
  });

  it('should know how old John and Jane Doe are', async () => {
    let answer = await bot.Answer('How old is John?');
    expect(answer).toEqual('33');

    answer = await bot.Answer('How old is Jane?');
    expect(answer).toEqual('31');
  });

  it('should know Jane\'s last name', async () => {
    let answer = await bot.Answer('What is Jane\'s last name?');
    expect(answer).toEqual('Dee');

    answer = await bot.Answer('What is Jane\'s surname?');
    expect(answer).toEqual('Dee');
  });

  it('should not know Jane\'s middle name', async () => {
    const answer = await bot.Answer('What is Jane\'s middle name?');
    expect(answer).toEqual(Bot.Unknown);
  });
});

type Person = {
  firstName: string,
  middleName: string,
  lastName: string,
  getQuoteFromWebsite: () => Promise<string>
};

describe('People index', () => {
  const peopleIndex = new SearchIndex<Person>();

  beforeAll(() => {
    peopleIndex.Insert((d) => [
      [`${d.firstName} ${d.middleName} ${d.lastName}`, d],
      [`${d.getQuoteFromWebsite}
- ${d.firstName} ${d.lastName}`, d]
    ], [
      {
        firstName: 'John',
        middleName: 'Dee',
        lastName: 'Doe',
        getQuoteFromWebsite: async () => 'I\'m the man!'
      },
      {
        firstName: 'Jane',
        middleName: 'Dee',
        lastName: 'Doe',
        getQuoteFromWebsite: async () => 'Do unto others as you would have them do unto you.'
      }
    ] as Person[]);
  });

  it('should return the record for John for the query "John Doe"', async () => {
    const results = await peopleIndex.Search('John Doe');
    expect(results[0].firstName).toEqual('John');
  });

  it('should return the record for Jane for the query "Jane Dee Doe"', async () => {
    const results = await peopleIndex.Search('Jane Dee Doe');
    expect(results[0].firstName).toEqual('Jane');
  });

  it('should return the record for John for the query "I\'m the man"', async () => {
    const results = await peopleIndex.Search('I\'m the man');
    expect(results[0].firstName).toEqual('John');
  });

  it('should return the record for Jane for the query "as you would have them"', async () => {
    const results = await peopleIndex.Search('as you would have them');
    expect(results[0].firstName).toEqual('Jane');
  });
});
