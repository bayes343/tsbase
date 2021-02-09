/* eslint-disable max-lines */
import { Errors } from '../Errors';
import { Strings } from '../Constants/Strings';
import { Regex } from '../Constants/Regex';
import { ArrayFunctions } from '../Functions/ArrayFunctions';
import { LogEntry, Logger, LogLevel } from '../Utility/module';

export abstract class Queryable<T> {
  /**
   * Gets or sets the element at the specified index.
   */
  protected item = new Array<T>();
  public get Item(): Array<T> {
    return this.item;
  }
  public set Item(v: Array<T>) {
    this.item = v;
  }

  /**
   * Returns a generic Queryable object providing easy access to the query centric Queryable api surface for standard arrays
   * @param array
   */
  public static From<T>(array: Array<T>): Queryable<T> {
    class QueryableArray<T2> extends Queryable<T2> {
      constructor(array2: Array<T2>) {
        super();
        this.item = array2;
      }
      public Clone(array2: Array<T2>): Queryable<T2> {
        return new QueryableArray<T2>(array2);
      }
    }

    return new QueryableArray<T>(array);
  }

  /**
   * Each extender should define how it should be cloned *structurally* - allows functional
   * chaining of a data structure that maintains state
   * @param item
   */
  protected abstract Clone(item: Array<T>): Queryable<T>;

  /**
   * Applies an accumulator function over a sequence. The specified seed value is used as the
   * initial accumulator value, and the specified function is used to select the result value.
   * @param seed
   * @param func
   */
  public Aggregate<TResult, TAccumulate>(
    seed: TAccumulate,
    func: (current: TAccumulate, next: T) => TAccumulate,
    resultSelector: (item: TAccumulate) => TResult
  ): TResult {
    let value = seed;
    for (let index = 0; index < this.item.length; index++) {
      value = func(value, this.item[index]);
    }
    return resultSelector(value);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @param func
   */
  public All(func: (item: T) => boolean): boolean {
    const itemsThatSatisfy = this.item.filter(func);
    return itemsThatSatisfy.length === this.item.length;
  }

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @param func
   */
  public Any(func: (item: T) => boolean): boolean {
    const itemsThatSatisfy = this.item.filter(func);
    return itemsThatSatisfy.length >= 1 ? true : false;
  }

  /**
   * Returns a collection with the given value Appended to the end of the sequence.
   * @param item
   */
  public Append(item: T): Queryable<T> {
    const appendedArray = this.item.slice();
    appendedArray.push(item);
    return this.Clone(appendedArray);
  }

  /**
   * Returns a collection with the given value Prepended to the beginning of the sequence.
   * @param item
   */
  public Prepend(item: T): Queryable<T> {
    const prependedArray = [item].concat(this.item);
    return this.Clone(prependedArray);
  }

  /**
   * Computes the average of a sequence of numeric values, or the average result of the given function
   * @param func
   */
  public Average(func?: (item: T) => number): number {
    if (this.item.length >= 1) {
      let average = 0;
      if (func) {
        average = this.Sum(func) / this.item.length;
      } else {
        average = this.Sum() / this.item.length;
      }
      return average;
    } else {
      const error = new Error(`${Errors.InvalidOperation} - Cannot calculate an average from a collection with no elements`);
      Logger.Log(new LogEntry(error.message, LogLevel.Error, error));
      throw error;
    }
  }

  /**
   * Determines whether an element is in the collection
   * @param object
   */
  public Contains(object: T): boolean {
    let isContained = this.item.indexOf(object) >= 0;

    if (!isContained && typeof object === 'object') {
      const stringifiedCollection = JSON.stringify(this.item);
      const stringifiedObject = JSON.stringify(object);
      isContained = stringifiedCollection.indexOf(stringifiedObject) >= 0;
    }
    return isContained;
  }

  /**
   * Produces the set difference of two sequences.
   * @param items
   */
  public Except(items: Array<T>): Queryable<T> {
    let collectionCopy = this.item.slice();
    const stringifiedItemsToExclude = JSON.stringify(items);
    collectionCopy = collectionCopy.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);
    return this.Clone(collectionCopy);
  }

  /**
   * Returns the first element of a sequence or null if the sequence is empty.
   * @param func optionally retrieve the first element which satisfies the given predicate
   */
  public First(func?: (item: T) => boolean): T | null {
    if (func) {
      let firstSatisfyingElement: T | null = null;

      for (let index = 0; index < this.item.length; index++) {
        const element = this.item[index];
        if (func(element)) {
          firstSatisfyingElement = element;
          break;
        }
      }

      return firstSatisfyingElement;
    } else {
      const firstElement = this.item.length >= 1 ? this.item[0] : null;
      return firstElement;
    }
  }

  /**
   * Returns the last element of a sequence or null if the sequence is empty.
   * @param func optionally retrieve the last element which satisfies the given predicate
   */
  public Last(func?: (item: T) => boolean): T | null {
    if (func) {
      let lastSatisfyingElement: T | null = null;

      for (let index = this.item.length - 1; index >= 0; index--) {
        const element = this.item[index];
        if (func(element)) {
          lastSatisfyingElement = element;
          break;
        }
      }

      return lastSatisfyingElement;
    } else {
      const lastElement = this.item.length >= 1 ? this.item[this.item.length - 1] : null;
      return lastElement;
    }
  }

  /**
   * Computes the sum of a sequence of numeric values, or the sum result of the given function
   * @param func
   */
  public Sum(func?: (item: T) => number): number {
    let sum = 0;
    if (func) {
      this.item.forEach(element => {
        sum += func(element);
      });
    } else {
      this.item.forEach(element => {
        const tNumber = parseFloat((element as {}).toString());
        if (isNaN(tNumber)) {
          const error = new Error(`${Errors.InvalidOperation} - Could not parse \'${element}\' as a number`);
          Logger.Log(new LogEntry(error.message, LogLevel.Error, error));
          throw error;
        }
        sum += tNumber;
      });
    }
    return sum;
  }

  /**
   * Filters a sequence of values based on a predicate.
   * @param func
   */
  public Where(func: (item: T) => boolean): Queryable<T> {
    const collection: Queryable<T> = this.Clone(this.item);
    collection.Item = collection.Item.filter(func);
    return collection;
  }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs
   */
  public OrderBy(funcs?: Array<(item: T) => number>): Queryable<T> {
    const collection = this.Clone(this.item);
    if (!funcs) {
      collection.Item.sort();
    } else {
      collection.Item.sort((a: T, b: T) => {
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
    return collection;
  }

  /**
   * Sorts the elements of a sequence in descending order.
   * @param func
   */
  public OrderByDescending(funcs?: Array<(item: T) => number>): Queryable<T> {
    let collection: Queryable<T>;
    if (funcs) {
      collection = this.OrderBy(funcs);
    } else {
      collection = this.OrderBy();
    }
    collection.Item.reverse();
    return collection;
  }

  /**
   * Creates an array from a IQueryable<T>.
   */
  public ToArray(): Array<T> {
    let newItemArray = new Array<T>();
    newItemArray = newItemArray.concat(this.item);
    return newItemArray;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param count
   */
  public Take(count: number): Queryable<T> {
    const itemsToTake = this.item.slice(0, count);
    const queryableToReturn = this.Clone(itemsToTake);
    return queryableToReturn;
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   * @param func
   */
  public TakeWhile(func: (item: T) => boolean): Queryable<T> {
    const itemsToReturn = [];
    let index = 0;
    let conditionPassed = true;
    do {
      if (this.item.length - 1 >= index) {
        const element = this.item[index];
        if (func(element)) {
          itemsToReturn.push(element);
        } else {
          conditionPassed = false;
        }
        index++;
      } else {
        conditionPassed = false;
      }
    } while (conditionPassed);
    return this.Clone(itemsToReturn);
  }

  /**
   * Returns distinct elements from a sequence.
   * @param func
   */
  public Distinct(): Queryable<T> {
    const itemsToReturn = [];
    for (let index = 0; index < this.item.length; index++) {
      const element = this.item[index];
      const stringifiedItems = JSON.stringify(itemsToReturn);
      if (stringifiedItems.indexOf(JSON.stringify(element)) === -1) {
        itemsToReturn.push(element);
      }
    }
    return this.Clone(itemsToReturn);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param count
   */
  public Skip(count: number): Queryable<T> {
    const itemsToReturn = this.item.slice(count, this.item.length);
    return this.Clone(itemsToReturn);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * @param func
   */
  public SkipWhile(func: (item: T) => boolean): Queryable<T> {
    let startIndex = 0;
    for (let index = 0; index < this.item.length && startIndex === 0; index++) {
      const element = this.item[index];
      if (!func(element)) {
        startIndex = index;
      }
    }
    const itemsToReturn = this.item.slice(startIndex, this.item.length);
    return this.Clone(itemsToReturn);
  }

  /**
   * Returns a random item from the collection based on Knuth shuffle
   * @param excluding - optionally exclude an array of items when selecting a random element
   */
  public GetRandom(excluding?: Array<T>): T | null {
    const candidateElements = excluding ? this.Except(excluding).ToArray() : this.ToArray();
    const shuffledItems = ArrayFunctions.Shuffle(candidateElements);
    return shuffledItems.length >= 1 ? shuffledItems[0] : null;
  }

  /**
   * Returns the element with the minimum value in a sequence of values.
   * @param func
   */
  public Min(func: (item: T) => any = item => item): T {
    if (this.item.length < 1) {
      const error = Error(`${Errors.InvalidOperation} - you cannot use the Min() function on an empty collection.`);
      Logger.Log(new LogEntry(error.message, LogLevel.Error, error));
      throw error;
    }

    return this.Aggregate<T, T>(
      this.item[0],
      (current, next) => func(current) < func(next) ? current : next,
      item => item
    );
  }

  /**
   * Returns the element with the maximum value in a sequence of values.
   * @param func
   */
  public Max(func: (item: T) => any = item => item): T {
    if (this.item.length < 1) {
      const error = new Error(`${Errors.InvalidOperation} - you cannot use the Max() function on an empty collection.`);
      Logger.Log(new LogEntry(error.message, LogLevel.Error, error));
      throw error;
    }

    return this.Aggregate<T, T>(
      this.item[0],
      (current, next) => func(current) > func(next) ? current : next,
      item => item
    );
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

    stopWords.forEach(element => {
      element = element.toLowerCase();
    });

    const exactMatches = this.Where(
      item => JSON.stringify(item).toLowerCase().indexOf(term.toLowerCase()) >= 0).ToArray();

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
          const keywordMatchesFound = this.Where(
            item => JSON.stringify(item).toLowerCase().indexOf(keyword.toLowerCase()) >= 0);
          keywordMatches = keywordMatches.concat(keywordMatchesFound.ToArray());
        }
      });
    }

    return keywordMatches;
  }
}
