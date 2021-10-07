export abstract class Queryable<T> {
  /**
   * Gets or sets the element at the specified index.
   */
  public item = new Array<T>();
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
   * deprecated
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
   * deprecated
   */
  public Except(items: Array<T>): Queryable<T> {
    let collectionCopy = this.item.slice();
    const stringifiedItemsToExclude = JSON.stringify(items);
    collectionCopy = collectionCopy.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);
    return this.Clone(collectionCopy);
  }
}
