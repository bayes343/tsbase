import { List } from './List';
import { Errors } from '../Errors';

export class SortedList<T> extends List<T> {
  /**
   * The function that determines the order items in the collection are sorted by
   */
  public SortingFunction: any;

  /**
   * Gets or sets the element at the specified index.
   */
  public get Item(): Array<T> {
    this.Sort(this.SortingFunction);
    return this.item;
  }
  public set Item(v: Array<T>) {
    this.item = v;
  }

  constructor(initParam?: Array<T>, sortingFunction?: (item: T) => any) {
    super();
    this.SortingFunction = sortingFunction;
    if (initParam && initParam.length) {
      this.item = initParam.slice();
    }
  }

  //#region Overrides
  /**
   * Not applicable for SortedList - calling will throw OperationInvalid exception
   */
  public Reverse(): void {
    throw new Error(`${Errors.InvalidOperation} - You cannot reverse a SortedList`);
  }

  /**
   * Not applicable for SortedList - calling will throw OperationInvalid exception
   */
  public ReverseRange(): void {
    throw new Error(`${Errors.InvalidOperation} - You cannot reverse a range in a SortedList`);
  }

  /**
   * Not applicable for SortedList - calling will throw OperationInvalid exception
   */
  public Shuffle(): void {
    throw new Error(`${Errors.InvalidOperation} - You cannot shuffle a SortedList`);
  }
  //#endregion

}