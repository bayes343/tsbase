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
    const array = this.slice();
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return Queryable.From(array);
  }

  /**
   * Returns all elements except for the set specified.
   * @param items
   */
  public Except(items: Array<T>): Queryable<T> {
    let collectionCopy = this.slice();
    const stringifiedItemsToExclude = JSON.stringify(items);
    collectionCopy = collectionCopy.filter(item => stringifiedItemsToExclude.indexOf(JSON.stringify(item)) < 0);

    return Queryable.From(collectionCopy);
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
}
