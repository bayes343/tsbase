import { List } from './List';

export class SortedList<T> extends List<T> {
  /**
   * The function that determines the order items in the collection are sorted by
   */
  public SortingFunction: any;

  constructor(initParam?: Array<T>, sortingFunction?: (item: T) => any) {
    super(initParam ? initParam : new Array<T>());
    this.SortingFunction = sortingFunction;
  }

  protected updateProperties(): void {
    this.Count = this.Item.length;
    this.Sort(this.SortingFunction);
  }
}