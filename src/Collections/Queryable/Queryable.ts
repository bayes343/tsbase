/* eslint-disable max-lines */
import { Regex } from '../../System/Regex';
import { Strings } from '../../System/Strings';
import { LogEntry, Logger, LogLevel } from '../../Utility/Logger/module';

export class Queryable<T> extends Array<T> {
  protected constructor() { super(); }

  public static From<T>(items: Array<T>): Queryable<T> {
    return Object.create(
      Queryable.prototype,
      Object.getOwnPropertyDescriptors(items) as unknown as PropertyDescriptorMap
    );
  }

  /**
   * Returns a copy of the array shuffled based on the knuth shuffle algorithm
   */
  public Shuffle(): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return Queryable.From(array);
    });
  }

  /**
   * Returns all elements except for the set specified.
   * @param items
   */
  public Except(items: Array<T>): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      const stringifiedItemsToExclude = JSON.stringify(items);
      array = array.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);

      return Queryable.From(array);
    });
  }

  /**
   * Returns a random item from the array based on Knuth shuffle
   * @param excluding - optionally exclude an array of items when selecting a random element
   */
  public GetRandom(excluding?: Array<T>): T | null {
    const candidateElements = excluding ? this.Except(excluding) : this;
    const shuffledItems = candidateElements.Shuffle();

    return shuffledItems.length >= 1 ? shuffledItems[0] : null;
  }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs
   */
  public OrderBy(funcs?: Array<(item: T) => number | string>): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      if (!funcs) {
        array.sort();
      } else {
        array.sort((a: T, b: T) => {
          let result = 0;
          for (let index = 0; index < funcs.length; index++) {
            const func = funcs[index];
            if (func(a) < func(b)) {
              result = -1;
              break;
            } else if (func(a) > func(b)) {
              result = 1;
              break;
            }
          }
          return result;
        });
      }

      return Queryable.From(array);
    });
  }

  /**
   * Sorts the elements of a sequence in descending order.
   * @param func
   */
  public OrderByDescending(funcs?: Array<(item: T) => number | string>): Queryable<T> {
    return Queryable.From(this.OrderBy(funcs).reverse());
  }


  /**
   * Returns the first element of a sequence or null if the sequence is empty.
   * @param func optionally retrieve the first element which satisfies the given predicate
   */
  public First(func?: (item: T) => boolean): T | null {
    if (func) {
      return this.find(func) || null;
    } else {
      const firstElement = this.length >= 1 ? this[0] : null;
      return firstElement;
    }
  }

  /**
   * Returns the last element of a sequence or null if the sequence is empty.
   * @param func optionally retrieve the last element which satisfies the given predicate
   */
  public Last(func?: (item: T) => boolean): T | null {
    if (func) {
      return this.slice().reverse().find(func) || null;
    } else {
      const lastElement = this.length >= 1 ? this[this.length - 1] : null;
      return lastElement;
    }
  }

  /**
   * Returns the element with the minimum value in a sequence of values.
   * @param func
   */
  public Min(func: (item: T) => any = item => item): T | null {
    return this.length < 1 ?
      null :
      this.reduce<T>(
        (current: T, next: T) => func(current) < func(next) ? current : next,
        this[0]
      );
  }

  /**
   * Returns the element with the maximum value in a sequence of values.
   * @param func
   */
  public Max(func: (item: T) => any = item => item): T | null {
    return this.length < 1 ?
      null :
      this.reduce<T>(
        (current: T, next: T) => func(current) > func(next) ? current : next,
        this[0]
      );
  }

  /**
   * Computes the sum of a sequence of numeric values, or the sum result of the given function
   * @param func
   */
  public Sum(func?: (item: T) => number): number | null {
    try {
      let sum = 0;

      if (func) {
        this.forEach(element => {
          sum += func(element);
        });
      } else {
        this.forEach(element => {
          const tNumber = parseFloat((element as {}).toString());
          if (isNaN(tNumber)) {
            throw new Error(`Sum failed - \"${tNumber}\" is not a number.`);
          }
          sum += tNumber;
        });
      }

      return sum;
    } catch (error) {
      Logger.Instance.Log(new LogEntry((error as Error).message, LogLevel.Error, error as Error));
      return null;
    }
  }

  /**
   * Computes the average of a sequence of numeric values, or the average result of the given function
   * @param func
   */
  public Average(func?: (item: T) => number): number | null {
    const sum = func ? this.Sum(func) : this.Sum();

    return this.length > 0 && sum ?
      sum / this.length :
      null;
  }


  /**
   * Returns distinct elements from a sequence.
   * @param func
   */
  public Distinct(): Queryable<T> {
    const itemsToReturn = [];

    for (let index = 0; index < this.length; index++) {
      const element = this[index];
      const stringifiedItems = JSON.stringify(itemsToReturn);

      if (stringifiedItems.indexOf(JSON.stringify(element)) === -1) {
        itemsToReturn.push(element);
      }
    }

    return Queryable.From(itemsToReturn);
  }

  /**
   * Perform a full text search on a collection for a given search term. Elements containing the entire search term
   * are given precedence over keyword matches.
   * @param term The term being searched for
   * @param minimumKeywordLength Keywords in the search term with a length less than this won't be considered
   * @param stopWords Keywords matching these words are not considered
   * @param ignorableSuffixCharacters Characters that should not prevent a positive match
   * (i.e. allows toy's' to match on toy)
   */
  public Search(
    term: string,
    minimumKeywordLength = 3,
    stopWords = new Array<string>(),
    ignorableSuffixCharacters = new Array<string>()
  ): Queryable<T> {
    const keywords = this.getKeywordsForTerm(term, ignorableSuffixCharacters);

    stopWords = stopWords.map(s => s.toLowerCase());

    const exactMatches = this.filter(
      item => JSON.stringify(item).toLowerCase().indexOf(term.toLowerCase()) >= 0).slice();

    const keywordMatches = this.getKeywordMatches(keywords, minimumKeywordLength, stopWords);

    const distinctResults = Queryable.From(exactMatches.concat(keywordMatches)).Distinct();
    return distinctResults;
  }

  private getKeywordsForTerm(term: string, ignorableSuffixCharacters?: Array<string>) {
    const keywords = term.split(Strings.Space);

    keywords.forEach(element => {
      element = element.replace(Regex.NonAlphaNumeric, Strings.Empty);

      const lastCharacter = element[element.length - 1];
      if (ignorableSuffixCharacters && ignorableSuffixCharacters.indexOf(lastCharacter) >= 0) {
        keywords.push(element.split(lastCharacter)[0]);
      }
    });

    return keywords;
  }

  private getKeywordMatches(keywords: string[], minimumKeywordLength: number, stopWords: string[]) {
    let keywordMatches = new Array<T>();

    if (keywords.length > 0) {
      keywords.forEach(keyword => {
        if (keyword.length >= minimumKeywordLength &&
          stopWords.indexOf(keyword.toLowerCase()) < 0) {
          const keywordMatchesFound = this.filter(
            item => JSON.stringify(item).toLowerCase().indexOf(keyword.toLowerCase()) >= 0);
          keywordMatches = keywordMatches.concat(keywordMatchesFound.slice());
        }
      });
    }

    return keywordMatches;
  }

  private mutableArrayQuery(func: (array: Array<T>) => Array<T>): Queryable<T> {
    return Queryable.From(func(this.slice()));
  }
}
