import { List } from '../Collections/Generic/List';

export abstract class Enumerable<T> {
  /**
   * Enumerable implementation
   */
  public Item: Array<T> = new Array<T>();

  /**
   * Each extender should define how it should be cloned *structurally* - allows functional chaining of a data structure that maintains state
   * @param item 
   */
  protected abstract Clone(item: Array<T>): Enumerable<T>;

  /**
   * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
   * @param seed 
   * @param func 
   */
  public Aggregate<TResult, TAccumulate>(
    seed: TAccumulate,
    func: (current: TAccumulate, next: T) => TAccumulate,
    resultSelector: (item: TAccumulate) => TResult
  ): TResult {
    let value = seed;
    for (let index = 0; index < this.Item.length; index++) {
      value = func(value, this.Item[index]);
    }
    return resultSelector(value);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @param func 
   */
  public All(func: (item: T) => boolean): boolean {
    const itemsThatSatisfy = this.Item.filter(func);
    return itemsThatSatisfy.length === this.Item.length;
  }

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @param func 
   */
  public Any(func: (item: T) => boolean): boolean {
    const itemsThatSatisfy = this.Item.filter(func);
    return itemsThatSatisfy.length >= 1 ? true : false;
  }

  /**
   * Computes the average of a sequence of numeric values, or the average result of the given function
   * @param func 
   */
  public Average(func?: (item: T) => any): number {
    if (this.Item.length >= 1) {
      let average = 0;
      if (func) {
        average = this.Sum(func) / this.Item.length;
      } else {
        average = this.Sum() / this.Item.length;
      }
      return average;
    } else {
      throw new Error('Cannot calculate an average from a collection with no elements');
    }
  }

  /**
   * Computes the sum of a sequence of numeric values, or the sum result of the given function
   * @param func 
   */
  public Sum(func?: (item: T) => number): number {
    let sum = 0;
    if (func) {
      this.Item.forEach(element => {
        sum += func(element);
      });
    } else {
      this.Item.forEach(element => {
        const tNumber = parseFloat(element.toString());
        if (isNaN(tNumber)) {
          throw new Error(`Could not parse \'${element}\' as a number`);
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
  public Where(func: (item: T) => boolean): Enumerable<T> {
    const collection: Enumerable<T> = this.Clone(this.Item);
    collection.Item = collection.Item.filter(func);
    return collection;
  }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs 
   */
  public OrderBy(funcs?: Array<(item: T) => any>): Enumerable<T> {
    const collection = this.Clone(this.Item);
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
  public OrderByDescending(funcs?: Array<(item: T) => any>): Enumerable<T> {
    let collection: Enumerable<T>;
    if (funcs) {
      collection = this.OrderBy(funcs);
    }
    collection = this.OrderBy();
    collection.Item.reverse();
    return collection;
  }

  /**
   * Creates a List<T> from an IEnumerable<T>.
   */
  public ToList(): List<T> {
    return new List<T>(this.Item);
  }

  /**
   * Creates an array from a IEnumerable<T>.
   */
  public ToArray(): Array<T> {
    let newItemArray = new Array<T>();
    newItemArray = newItemArray.concat(this.Item);
    return newItemArray;
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @param count 
   */
  public Take(count: number): Enumerable<T> {
    const itemsToTake = this.Item.slice(0, count);
    const enumerableToReturn = this.Clone(itemsToTake);
    return enumerableToReturn;
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   * @param func 
   */
  public TakeWhile(func: (item: T) => boolean): Enumerable<T> {
    const itemsToReturn = [];
    let index = 0;
    let conditionPassed = true;
    do {
      if (this.Item.length - 1 >= index) {
        const element = this.Item[index];
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
  public Distinct(): Enumerable<T> {
    const itemsToReturn = [];
    for (let index = 0; index < this.Item.length; index++) {
      const element = this.Item[index];
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
  public Skip(count: number): Enumerable<T> {
    const itemsToReturn = this.Item.slice(count, this.Item.length);
    return this.Clone(itemsToReturn);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * @param func 
   */
  public SkipWhile(func: (item: T) => boolean): Enumerable<T> {
    let startIndex = 0;
    for (let index = 0; index < this.Item.length && startIndex === 0; index++) {
      const element = this.Item[index];
      if (!func(element)) {
        startIndex = index;
      }
    }
    const itemsToReturn = this.Item.slice(startIndex, this.Item.length);
    return this.Clone(itemsToReturn);
  }

}