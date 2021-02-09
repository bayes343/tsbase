/* eslint-disable max-lines */
/* eslint-disable complexity */
import { ArrayFunctions } from '../Functions/ArrayFunctions';
import { Errors } from '../Errors';
import { Queryable } from './Queryable';
import { Command } from '../Patterns/module';

export class List<T> extends Queryable<T> {
  /**
   * Gets the number of elements contained in the List<T>.
   */
  public get Count(): number {
    return this.item.length;
  }

  /**
   * List<T>() Initializes a new instance of the List<T> class that is empty and has the default initial capacity.
   * List<T>(IQueryable<T>) Initializes a new instance of the List<T> class that contains elements copied from the
   * specified collection and has sufficient capacity to accommodate the number of elements copied.
   */
  constructor();
  constructor(initParam: Array<T>);
  constructor(initParam?: Array<T> | undefined) {
    super();
    if (initParam && initParam.length) {
      this.item = initParam.slice();
    }
  }

  /**
   * Implement abstract Queryable contract
   * @param item
   */
  protected Clone(item: Array<T>): Queryable<T> {
    return new List<T>(item);
  }

  /**
   * Adds an object to the end of the List<T>.
   * @param object
   */
  public Add(object: T): void {
    this.item.push(object);
  }

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   * @param elements
   */
  public AddRange(elements: Array<T>): void {
    this.item = this.item.concat(elements);
  }

  /**
   * Removes all elements from the List<T>.
   */
  public Clear(): void {
    this.item = new Array();
  }

  /**
   * Copies the List<T> or a portion of it to an array.
   * @param array
   * @param arrayIndex
   */
  public CopyTo(array: Array<T>, startIndex?: number, endIndex?: number): void {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex ? endIndex : this.item.length;
    for (let index = startIndex; index < endIndex; index++) {
      const element = this.item[index];
      array.push(element);
    }
  }

  /**
   * Determines whether the List<T> contains elements that match the conditions defined by the specified predicate.
   * @param match
   */
  public Exists(match: (item: T) => boolean): boolean {
    return this.Any(match);
  }

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first
   * occurrence within the entire List<T>.
   * @param match
   */
  public Find(match: (item: T) => boolean): T | null {
    return this.Where(match).First();
  }

  /**
   * Retrieves all the elements that match the conditions defined by the specified predicate.
   * @param match
   */
  public FindAll(match: (item: T) => boolean): List<T> {
    const matchingElements = this.Item.filter(item => match(item));
    return new List<T>(matchingElements);
  }

  /**
   * Searches for an element that matches the conditions defined by a specified predicate, and returns the
   * zero-based index of the first occurrence within the List<T> or a portion of it. This method returns
   * -1 if an item that matches the conditions is not found.
   * @param match
   * @param startIndex
   * @param endIndex
   */
  public FindIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex ? endIndex : this.Item.length;
    let index = -1;
    for (let i = startIndex; i < endIndex && index === -1; i++) {
      const element = this.Item[i];
      if (match(element)) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and
   * returns the last occurrence within the entire List<T>.
   * @param match
   */
  public FindLast(match: (item: T) => boolean): T | null {
    return this.Where(match).Last();
  }

  /**
   * Searches for an element that matches the conditions defined by a specified predicate, and returns the
   * zero-based index of the last occurrence within the List<T> or a portion of it.
   * @param match
   * @param startIndex
   * @param endIndex
   */
  public FindLastIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex && endIndex <= this.Count - 1 ? endIndex : this.Count - 1;
    let index = -1;
    for (let i = endIndex; i >= startIndex && index === -1; i--) {
      const element = this.item[i];
      if (match(element)) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Performs the specified action on each element of the List<T>.
   * @param action
   */
  public ForEach(action: (item: T) => void): void {
    this.Item.forEach(element => {
      action(element);
    });
  }

  /**
   * Creates a shallow copy of a range of elements in the source List<T>.
   * @param index
   * @param count
   */
  public GetRange(index: number, count: number): List<T> {
    const range = new List<T>();
    for (let i = index; i < count; i++) {
      const element = this.Item[i];
      range.Add(element);
    }
    return range;
  }

  /**
   * Searches for the specified object and returns the zero-based index of the first occurrence within
   * the range of elements in the List<T> that extends from the specified index to the last element.
   * @param item
   * @param startIndex
   */
  public IndexOf(item: T, startIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    let index = -1;
    for (let i = startIndex; i < this.Item.length && index === -1; i++) {
      if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Returns the zero-based index of the last occurrence of a value in the List<T> or in a portion of it.
   * @param item
   * @param endIndex
   */
  public LastIndexOf(item: T, endIndex?: number): number {
    endIndex = endIndex ? endIndex : this.Count - 1;
    let index = -1;
    for (let i = endIndex; i >= 0 && index === -1; i--) {
      if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Sorts the elements or a portion of the elements in the List<T> using either the specified or
   * default IComparer<T> implementation or a provided Comparison<T> delegate to compare list elements.
   * @param comparison
   */
  public Sort(comparison?: (item: T) => number): void {
    this.item = comparison ?
      this.item = this.OrderBy([comparison]).ToArray() :
      this.item.sort();
  }

  /**
   * Inserts an element into the List<T> at the specified index.
   * @param index
   * @param item
   */
  public Insert(index: number, item: T): void {
    new Command(() => {
      if (index >= 0 && this.item.length >= index) {
        this.item.splice(index, 0, item);
      } else {
        throw new Error(`${Errors.IndexOutOfRange} - Range: 0-${this.item.length} | Passed index: ${index}`);
      }
    }).Execute();
  }

  /**
   * Inserts the elements of a collection into the List<T> at the specified index.
   * @param index
   * @param collection
   */
  public InsertRange(index: number, collection: List<T>): void {
    new Command(() => {
      if (index >= 0 && this.item.length >= index) {
        for (let i = 0; i < collection.Count; i++) {
          const element = collection.Item[i];
          this.item.splice(index + i, 0, element);
        }
      } else {
        throw new Error(`${Errors.IndexOutOfRange} - Range: 0-${this.item.length} | Passed index: ${index}`);
      }
    }).Execute();
  }

  /**
   * Removes the first occurrence of a specific object from the List<T>.
   * @param item
   */
  public Remove(item: T): boolean {
    const itemIndex = this.IndexOf(item);
    if (itemIndex >= 0) {
      this.item.splice(itemIndex, 1);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   * @param match
   */
  public RemoveAll(match: (item: T) => boolean): number {
    const elementsToRemove = this.Where(match);
    elementsToRemove.Item.forEach(element => {
      this.Remove(element);
    });
    return elementsToRemove.Item.length;
  }

  /**
   * Removes the element at the specified index of the List<T>.
   * @param index
   */
  public RemoveAt(index: number): void {
    new Command(() => {
      if (index >= 0 && this.item.length >= index) {
        this.item.splice(index, 1);
      } else {
        throw new Error(`${Errors.IndexOutOfRange} - Range: 0-${this.item.length} | Passed index: ${index}`);
      }
    }).Execute();
  }

  /**
   * Removes a range of elements from the List<T>.
   * @param index
   * @param count
   */
  public RemoveRange(index: number, count: number): void {
    new Command(() => {
      if (index >= 0 && this.item.length >= index && this.item.length >= index + count) {
        this.item.splice(index, count);
      } else {
        throw new Error(
          `${Errors.IndexOutOfRange} - Range: 0-${this.item.length} | Passed index: ${index} | Passed count: ${count}`);
      }
    }).Execute();
  }

  /**
   * Reverses the order of the elements in the entire List<T>.
   */
  public Reverse(): void {
    this.item.reverse();
  }

  /**
   * Reverses the order of the elements in the specified range.
   * @param index
   * @param count
   */
  public ReverseRange(index: number, count: number): void {
    const arraySegment = this.item.splice(index, count);
    arraySegment.reverse();
    this.InsertRange(index, new List<T>(arraySegment));
  }

  /**
   * Shuffles the collection of items stored in the list
   */
  public Shuffle(): void {
    ArrayFunctions.Shuffle(this.item);
  }
}
