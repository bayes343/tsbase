import { List } from './List';

export class SortedList<T> extends List<T> {
  /**
   * The function that determines the order items in the collection are sorted by
   */
  public SortingFunction: any;

  /**
   * Gets or sets the element at the specified index.
   */
  protected item = new Array<T>();
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

}