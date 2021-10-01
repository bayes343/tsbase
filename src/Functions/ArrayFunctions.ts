export class ArrayFunctions {
  private constructor() { }

  /**
   * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
   * @param funcs
   */
  public static OrderBy<T>(collection: Array<T>, funcs?: Array<(item: T) => number>): Array<T> {
    if (!funcs) {
      collection.sort();
    } else {
      collection.sort((a: T, b: T) => {
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
  public static OrderByDescending<T>(collection: Array<T>, funcs?: Array<(item: T) => number>): Array<T> {
    return this.OrderBy(collection, funcs).reverse();
  }

  /**
   * TODO - make functional - copy given array and return copy
   * Returns the given array shuffled based on the knuth shuffle algorithm
   * @param array
   */
  public static Shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
