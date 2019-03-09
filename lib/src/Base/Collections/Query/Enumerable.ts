import { BaseFunctions } from '../../Functions/BaseFunctions';

export abstract class Enumerable<T> {
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
   * Returns a generic enumerable object providing easy access to the query centric Enumerable api surface for standard arrays
   * @param array 
   */
  public static From<T>(array: Array<T>): Enumerable<T> {
    class EnumerableArray<T> extends Enumerable<T> {
      constructor(array: Array<T>) {
        super();
        this.item = array;
      }
      public Clone(array: Array<T>): Enumerable<T> {
        return new EnumerableArray<T>(array);
      }
    }

    return new EnumerableArray<T>(array);
  }

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
  public Append(item: T): Enumerable<T> {
    const appendedArray = this.item.slice();
    appendedArray.push(item);
    return this.Clone(appendedArray);
  }

  /**
   * Returns a collection with the given value Prepended to the beginning of the sequence.
   * @param item 
   */
  public Prepend(item: T): Enumerable<T> {
    const prependedArray = [item].concat(this.item);
    return this.Clone(prependedArray);
  }

  /**
   * Computes the average of a sequence of numeric values, or the average result of the given function
   * @param func 
   */
  public Average(func?: (item: T) => any): number {
    if (this.item.length >= 1) {
      let average = 0;
      if (func) {
        average = this.Sum(func) / this.item.length;
      } else {
        average = this.Sum() / this.item.length;
      }
      return average;
    } else {
      throw new Error('Cannot calculate an average from a collection with no elements');
    }
  }

  /**
   * Determines whether an element is in the collection
   * Checks if every key on the parameter object matches every key on a member (contained) object
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
  public Except(items: Array<T>): Enumerable<T> {
    let collectionCopy = this.item.slice();
    const stringifiedItemsToExclude = JSON.stringify(items);
    collectionCopy = collectionCopy.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);
    return this.Clone(collectionCopy);
  }

  /**
   * Returns the first element of a sequence or null if the sequence is empty.
   */
  public First(): T | null {
    const firstElement = this.item.length >= 1 ? this.item[0] : null;
    return firstElement;
  }

  /**
   * Returns the last element of a sequence or null if the sequence is empty.
   */
  public Last(): T | null {
    const lastElement = this.item.length >= 1 ? this.item[this.item.length - 1] : null;
    return lastElement;
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
    const collection: Enumerable<T> = this.Clone(this.item);
    collection.Item = collection.Item.filter(func);
    return collection;
  }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs 
   */
  public OrderBy(funcs?: Array<(item: T) => any>): Enumerable<T> {
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
   * Creates an array from a IEnumerable<T>.
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
  public Take(count: number): Enumerable<T> {
    const itemsToTake = this.item.slice(0, count);
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
  public Distinct(): Enumerable<T> {
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
  public Skip(count: number): Enumerable<T> {
    const itemsToReturn = this.item.slice(count, this.item.length);
    return this.Clone(itemsToReturn);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * @param func 
   */
  public SkipWhile(func: (item: T) => boolean): Enumerable<T> {
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
    let candidateElements = excluding ? this.Except(excluding).ToArray() : this.ToArray();
    const shuffledItems = BaseFunctions.Shuffle(candidateElements);
    return shuffledItems.length >= 1 ? shuffledItems[0] : null;
  }

}