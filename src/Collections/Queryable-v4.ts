export class Queryable<T> extends Array<T> {
  private constructor() {
    super();
  }

  public static From<T>(items: Array<T>): Queryable<T> {
    return Object.create(Queryable.prototype, Object.getOwnPropertyDescriptors(items));
  }

  /**
   * Returns a copy of the array shuffled based on the knuth shuffle algorithm
   */
  public Shuffle(): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return Queryable.From(array);
    });
  }

  /**
   * Returns all elements except for the set specified.
   * @param items
   */
  public Except(items: Array<T>): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      const stringifiedItemsToExclude = JSON.stringify(items);
      array = array.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);

      return Queryable.From(array);
    });
  }

  /**
   * Returns a random item from the array based on Knuth shuffle
   * @param excluding - optionally exclude an array of items when selecting a random element
   */
  public GetRandom(excluding?: Array<T>): T | null {
    const candidateElements = excluding ? this.Except(excluding) : this;
    const shuffledItems = candidateElements.Shuffle();

    return shuffledItems.length >= 1 ? shuffledItems[0] : null;
  }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs
   */
  public OrderBy(funcs?: Array<(item: T) => number>): Queryable<T> {
    return this.mutableArrayQuery((array) => {
      if (!funcs) {
        array.sort();
      } else {
        array.sort((a: T, b: T) => {
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

      return Queryable.From(array);
    });
  }

  /**
   * Sorts the elements of a sequence in descending order.
   * @param func
   */
  public OrderByDescending(funcs?: Array<(item: T) => number>): Queryable<T> {
    return Queryable.From(this.OrderBy(funcs).reverse());
  }


  /**
   * Returns the first element of a sequence or null if the sequence is empty.
   * @param func optionally retrieve the first element which satisfies the given predicate
   */
  public First(func?: (item: T) => boolean): T | null {
    if (func) {
      let firstSatisfyingElement: T | null = null;

      for (let index = 0; index < this.length; index++) {
        const element = this[index];
        if (func(element)) {
          firstSatisfyingElement = element;
          break;
        }
      }

      return firstSatisfyingElement;
    } else {
      const firstElement = this.length >= 1 ? this[0] : null;
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

      for (let index = this.length - 1; index >= 0; index--) {
        const element = this[index];
        if (func(element)) {
          lastSatisfyingElement = element;
          break;
        }
      }

      return lastSatisfyingElement;
    } else {
      const lastElement = this.length >= 1 ? this[this.length - 1] : null;
      return lastElement;
    }
  }

  private mutableArrayQuery(func: (array: Array<T>) => Array<T>): Queryable<T> {
    return Queryable.From(func(this.slice()));
  }
}
