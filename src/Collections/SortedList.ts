import { List } from './List';
import { Errors } from '../Errors';
import { Command } from '../Patterns/CommandQuery/Command';

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
    new Command(() => {
      throw new Error(`${Errors.InvalidOperation} - You cannot reverse a SortedList`);
    }).Execute();
  }

  /**
   * Not applicable for SortedList - calling will throw OperationInvalid exception
   */
  public ReverseRange(): void {
    new Command(() => {
      throw new Error(`${Errors.InvalidOperation} - You cannot reverse a range in a SortedList`);
    }).Execute();
  }

  /**
   * Not applicable for SortedList - calling will throw OperationInvalid exception
   */
  public Shuffle(): void {
    new Command(() => {
      throw new Error(`${Errors.InvalidOperation} - You cannot shuffle a SortedList`);
    }).Execute();
  }
  //#endregion

}
