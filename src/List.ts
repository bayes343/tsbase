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
     * List<T>(Int32) Initializes a new instance of the List<T> class that is empty and has the specified initial capacity.
     */
    constructor();
    constructor(initParam: Array<T>);
    constructor(initParam?: any) {
      if (initParam && initParam.length) {
        this.Item = initParam;
      }

      if (initParam && !initParam.length) {
        this.Item = new Array(initParam);
      }

      this.updateStaticProperties();
    }

    /**
     * Adds an object to the end of the List<T>.
     * @param object 
     */
    public Add(object: T) {
      this.Item.push(object);
      this.updateStaticProperties();
    }

    /**
     * Adds the elements of the specified collection to the end of the List<T>.
     * @param elements 
     */
    public AddRange(elements: Array<T>) {
      this.Item = this.Item.concat(elements);
      this.updateStaticProperties();
    }

    /**
     * Removes all elements from the List<T>.
     */
    public Clear(): void {
      this.Item = new Array();
      this.updateStaticProperties();
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

    // ====================================== Private methods start ====================================== //

    private updateStaticProperties(): void {
      this.Capacity = this.Item.length;
      this.Count = this.Item.length;
    }

  }

}
