// Documentation copied from C# reference: https://msdn.microsoft.com/en-us/library/6sh2ey19(v=vs.110).aspx

namespace Collections {

  export class List<T> {
    /**
     * Gets or sets the total number of elements the internal data structure can hold without resizing.
     * Same as count - included merely for the sake of mimicking C#'s list api.
     */
    public Capacity: number = 0;

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
        this.Item = initParam;
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

      if (!isContained && typeof object === 'object') { // check keys in case of complex object
        const keys = Object.keys(object);
        if (this.Item.length >= 1 && keys) {
          this.Item.forEach(element => {
            const elementKeys = Object.keys(element);

            let keyMatches = 0;
            for (let index = 0; index < elementKeys.length; index++) {
              const memberElement: any = element;
              const objectElement: any = object;

              const memberKey = elementKeys[index];
              const searchKey = keys[index];
              if (memberElement[memberKey] === objectElement[searchKey]) {
                keyMatches++;
              }
            }
            isContained = keyMatches === keys.length;
          });
        }

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
      const collection = new List<T>();
      this.Item.forEach(element => {
        if (match(element)) {
          collection.Add(element);
        }
      });
      return collection;
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

    //#region Private implementation 'helpers'

    private updateProperties(): void {
      this.Capacity = this.Item.length;
      this.Count = this.Item.length;
    }

    //#endregion

  }

}