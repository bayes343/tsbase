export class BaseFunctions {
  private constructor() { }

  /**
   * Returns the given array shuffled based on the knuth shuffle algorithm
   * @param array 
   */
  public static Shuffle(array: Array<any>): Array<any> {
    var currentIndex = array.length, temporaryValue, randomIndex;

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