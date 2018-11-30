export class List<T> {
  /**
   * Gets the number of elements contained in the List<T>.
   */
  public Count: number = 0;

  /**
   * Gets or sets the element at the specified index.
   */
  public Item: Array<T> = new Array<T>();

  /**
   * List<T>() Initializes a new instance of the List<T> class that is empty and has the default initial capacity.
   * List<T>(IEnumerable<T>) Initializes a new instance of the List<T> class that contains elements copied from the specified collection and has sufficient capacity to accommodate the number of elements copied.
   */
  constructor();
  constructor(initParam: Array<T>);
  constructor(initParam?: any) {
    if (initParam && initParam.length) {
      this.Item = new Array<T>();
      for (let index = 0; index < initParam.length; index++) {
        const element = initParam[index];
        this.Item.push(element);
      }
    }

    this.updateProperties();
  }

  /**
   * Adds an object to the end of the List<T>.
   * @param object 
   */
  public Add(object: T) {
    this.Item.push(object);
    this.updateProperties();
  }

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   * @param elements 
   */
  public AddRange(elements: Array<T>) {
    this.Item = this.Item.concat(elements);
    this.updateProperties();
  }

  /**
   * Removes all elements from the List<T>.
   */
  public Clear(): void {
    this.Item = new Array();
    this.updateProperties();
  }

  /**
   * Determines whether an element is in the List<T>.
   * Currently checks if every key on the parameter object matches every key on a member (contained) object
   * @param object 
   */
  public Contains(object: T): boolean {
    let isContained = this.Item.indexOf(object) >= 0;

    if (!isContained && typeof object === 'object') {
      const stringifiedList = JSON.stringify(this.Item);
      const stringifiedObject = JSON.stringify(object);
      isContained = stringifiedList.indexOf(stringifiedObject) >= 0;
    }
    return isContained;
  }

  /**
   * Copies the List<T> or a portion of it to an array.
   * @param array 
   * @param arrayIndex 
   */
  public CopyTo(array: Array<T>, startIndex?: number, endIndex?: number): void {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex ? endIndex : this.Item.length;
    for (let index = startIndex; index < endIndex; index++) {
      const element = this.Item[index];
      array.push(element);
    }
  }

  /**
   * Determines whether the List<T> contains elements that match the conditions defined by the specified predicate.
   * @param match
   */
  public Exists(match: (item: T) => any): boolean {
    let answer = false;
    for (let index = 0; index < this.Item.length && !answer; index++) {
      const element = this.Item[index];
      if (match(element)) {
        answer = true;
      }
    }
    return answer;
  }

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List<T>.
   * @param match
   */
  public Find(match: (item: T) => any): T | null {
    for (let index = 0; index < this.Item.length; index++) {
      const element = this.Item[index];
      if (match(element)) {
        return (element);
      }
    }
    return null;
  }

  /**
   * Retrieves all the elements that match the conditions defined by the specified predicate.
   * @param match 
   */
  public FindAll(match: (item: T) => any): List<T> {
    const matchingElements = this.Item.filter(item => match(item));
    return new List<T>(matchingElements);
  }

  /**
   * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the first occurrence within the List<T> or a portion of it. This method returns -1 if an item that matches the conditions is not found.
   * @param match 
   * @param startIndex 
   * @param endIndex 
   */
  public FindIndex(match: (item: T) => any, startIndex?: number, endIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex ? endIndex : this.Item.length;
    let index = -1;
    for (let i = startIndex; i < endIndex && index === -1; i++) {
      const element = this.Item[i];
      if (match(element)) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Searches for an element that matches the conditions defined by the specified predicate, and returns the last occurrence within the entire List<T>.
   * @param match
   */
  public FindLast(match: (item: T) => any): T | null {
    for (let index = this.Count - 1; index >= 0; index--) {
      const element = this.Item[index];
      if (match(element)) {
        return (element);
      }
    }
    return null;
  }

  /**
   * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the last occurrence within the List<T> or a portion of it.
   * @param match
   * @param startIndex 
   * @param endIndex 
   */
  public FindLastIndex(match: (item: T) => any, startIndex?: number, endIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    endIndex = endIndex && endIndex <= this.Count - 1 ? endIndex : this.Count - 1;
    let index = -1;
    for (let i = endIndex; i >= startIndex && index === -1; i--) {
      const element = this.Item[i];
      if (match(element)) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Performs the specified action on each element of the List<T>.
   * @param action 
   */
  public ForEach(action: (item: T) => any): void {
    this.Item.forEach(element => {
      action(element);
    });
  }

  /**
   * Creates a shallow copy of a range of elements in the source List<T>.
   * @param index 
   * @param count 
   */
  public GetRange(index: number, count: number): List<T> {
    const range = new List<T>();
    for (let i = index; i < count; i++) {
      const element = this.Item[i];
      range.Add(element);
    }
    return range;
  }

  /**
   * Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the List<T> that extends from the specified index to the last element.
   * @param item 
   * @param startIndex 
   */
  public IndexOf(item: T, startIndex?: number): number {
    startIndex = startIndex ? startIndex : 0;
    let index = -1;
    for (let i = startIndex; i < this.Item.length && index === -1; i++) {
      if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Returns the zero-based index of the last occurrence of a value in the List<T> or in a portion of it.
   * @param item 
   * @param endIndex 
   */
  public LastIndexOf(item: T, endIndex?: number): number {
    endIndex = endIndex ? endIndex : this.Count - 1;
    let index = -1;
    for (let i = endIndex; i >= 0 && index === -1; i--) {
      if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
        index = i;
      }
    }
    return index;
  }

  /**
   * Copies the elements of the List<T> to a new array.
   */
  public ToArray(): Array<T> {
    let newItemArray = new Array<T>();
    newItemArray = newItemArray.concat(this.Item);
    return newItemArray;
  }

  /**
   * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
   * @param match 
   */
  public TrueForAll(match: (item: T) => any): boolean {
    let result = true;
    for (let index = 0; index < this.Item.length && result === true; index++) {
      const element = this.Item[index];
      if (!match(element)) {
        result = false;
      }
    }
    return result;
  }

  /**
   * Sorts the elements or a portion of the elements in the List<T> using either the specified or default IComparer<T> implementation or a provided Comparison<T> delegate to compare list elements.
   * @param comparison 
   */
  public Sort(comparison: (item: T) => any): void {
    this.Item.sort((a: T, b: T) => {
      if (comparison(a) < comparison(b)) {
        return -1;
      } else if (comparison(a) > comparison(b)) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Inserts an element into the List<T> at the specified index.
   * @param index 
   * @param item 
   */
  public Insert(index: number, item: T): void {
    if (index >= 0 && this.Item.length >= index) {
      this.Item.splice(index, 0, item);
      this.updateProperties();
    } else {
      throw (`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
    }
  }

  /**
   * Inserts the elements of a collection into the List<T> at the specified index.
   * @param index 
   * @param collection 
   */
  public InsertRange(index: number, collection: List<T>): void {
    if (index >= 0 && this.Item.length >= index) {
      for (let i = 0; i < collection.Count; i++) {
        const element = collection.Item[i];
        this.Item.splice(index + i, 0, element);
      }
      this.updateProperties();
    } else {
      throw (`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
    }
  }

  /**
   * Removes the first occurrence of a specific object from the List<T>.
   * @param item 
   */
  public Remove(item: T): boolean {
    const itemIndex = this.IndexOf(item);
    if (itemIndex >= 0) {
      this.Item.splice(itemIndex, 1);
      this.updateProperties();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   * @param match 
   */
  public RemoveAll(match: (item: T) => any): number {
    let count = 0;
    for (let index = 0; index < this.Item.length; index++) {
      const element = this.Item[index];
      if (match(element)) {
        this.Remove(element);
        index--;
        count++;
      }
    }
    return count;
  }

  /**
   * Removes the element at the specified index of the List<T>.
   * @param index 
   */
  public RemoveAt(index: number): void {
    if (index >= 0 && this.Item.length >= index) {
      this.Item.splice(index, 1);
      this.updateProperties();
    } else {
      throw (`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
    }
  }

  /**
   * Removes a range of elements from the List<T>.
   * @param index 
   * @param count 
   */
  public RemoveRange(index: number, count: number): void {
    if (index >= 0 && this.Item.length >= index && this.Item.length >= index + count) {
      this.Item.splice(index, count);
      this.updateProperties();
    } else {
      throw (`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index} | Passed count: ${count}`);
    }
  }

  /**
   * Reverses the order of the elements in the entire List<T>.
   */
  public Reverse(): void {
    this.Item.reverse();
  }

  /**
   * Reverses the order of the elements in the specified range.
   * @param index 
   * @param count 
   */
  public ReverseRange(index: number, count: number): void {
    const arraySegment = this.Item.splice(index, count);
    arraySegment.reverse();
    this.InsertRange(index, new List<T>(arraySegment));
  }

  //#region Private implementation 'helpers'
  private updateProperties(): void {
    this.Count = this.Item.length;
  }
  //#endregion

}
