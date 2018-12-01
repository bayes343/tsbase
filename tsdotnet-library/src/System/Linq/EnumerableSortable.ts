import { Enumerable } from './Enumerable';

export class EnumerableSortable<T> extends Enumerable<T> {

  /**
   * Implement abstract enumerable contract
   * @param item 
   */
  protected Clone(item: T[]): Enumerable<T> {
    return new EnumerableSortable(item, this.previousSortFunctions);
  }

  constructor(
    item: T[],
    private previousSortFunctions?: Array<(item: T) => any>
  ) {
    super();
    this.Item = item.slice();
  }

}