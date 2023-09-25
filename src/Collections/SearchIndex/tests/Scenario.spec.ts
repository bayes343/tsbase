import { Indexer } from '../ISearchIndex';
import { SearchIndex } from '../SearchIndex';

class Bot {
  constructor(
    private index = new SearchIndex<() => string>()
  ) { }

  Program = async <T>(data: T[], questionConfiguration: Indexer<T, () => string>): Promise<void> => {
    await this.index.Insert(data, questionConfiguration);
  };

  Answer = async (question: string): Promise<string> => {
    const answerFunc = await this.index.Answer(question);
    return answerFunc?.() || 'Sorry, I\'m not sure about that one...';
  };
}

describe('Bot', () => {
  const bot = new Bot();

  beforeAll(() => {
    bot.Program([
      'The year is',
      'WW2 Broke out in'
    ], (d) => [
      ['What year is it?', {
        item: () => `${d}: ${new Date().getFullYear().toString()}`,
        qualifier: (q) => ['what', 'year', 'is', 'it'].every(s => q.toLowerCase().toString().includes(s))
      }],
      ['What year did WW2 start?', {
        item: () => `${d}: 1939`,
        qualifier: (q) => ['what', 'year', 'ww2', 'start'].every(s => q.toLowerCase().includes(s))
      }]
    ]
    );
  });

  it('should know what year it is', async () => {
    const answer = await bot.Answer('What year is it?');
    expect(answer).toEqual(`The year is: ${new Date().getFullYear().toString()}`);
  });

  it('should know what year WW2 started', async () => {
    const answer = await bot.Answer('What year did WW2 start in?');
    expect(answer).toContain('1939');
  });
});
