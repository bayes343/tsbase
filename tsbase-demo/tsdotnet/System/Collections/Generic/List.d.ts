import { Enumerable } from '../../Linq/Enumerable';
export declare class List<T> extends Enumerable<T> {
    /**
     * Gets the number of elements contained in the List<T>.
     */
    Count: number;
    /**
     * Gets or sets the element at the specified index.
     */
    Item: Array<T>;
    /**
     * Implement abstract enumerable contract
     * @param item
     */
    protected Clone(item: Array<T>): Enumerable<T>;
    /**
     * List<T>() Initializes a new instance of the List<T> class that is empty and has the default initial capacity.
     * List<T>(IEnumerable<T>) Initializes a new instance of the List<T> class that contains elements copied from the specified collection and has sufficient capacity to accommodate the number of elements copied.
     */
    constructor();
    constructor(initParam: Array<T>);
    /**
     * Adds an object to the end of the List<T>.
     * @param object
     */
    Add(object: T): void;
    /**
     * Adds the elements of the specified collection to the end of the List<T>.
     * @param elements
     */
    AddRange(elements: Array<T>): void;
    /**
     * Removes all elements from the List<T>.
     */
    Clear(): void;
    /**
     * Determines whether an element is in the List<T>.
     * Currently checks if every key on the parameter object matches every key on a member (contained) object
     * @param object
     */
    Contains(object: T): boolean;
    /**
     * Copies the List<T> or a portion of it to an array.
     * @param array
     * @param arrayIndex
     */
    CopyTo(array: Array<T>, startIndex?: number, endIndex?: number): void;
    /**
     * Determines whether the List<T> contains elements that match the conditions defined by the specified predicate.
     * @param match
     */
    Exists(match: (item: T) => boolean): boolean;
    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List<T>.
     * @param match
     */
    Find(match: (item: T) => boolean): T | null;
    /**
     * Retrieves all the elements that match the conditions defined by the specified predicate.
     * @param match
     */
    FindAll(match: (item: T) => boolean): List<T>;
    /**
     * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the first occurrence within the List<T> or a portion of it. This method returns -1 if an item that matches the conditions is not found.
     * @param match
     * @param startIndex
     * @param endIndex
     */
    FindIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number;
    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the last occurrence within the entire List<T>.
     * @param match
     */
    FindLast(match: (item: T) => boolean): T | null;
    /**
     * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the last occurrence within the List<T> or a portion of it.
     * @param match
     * @param startIndex
     * @param endIndex
     */
    FindLastIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number;
    /**
     * Performs the specified action on each element of the List<T>.
     * @param action
     */
    ForEach(action: (item: T) => any): void;
    /**
     * Creates a shallow copy of a range of elements in the source List<T>.
     * @param index
     * @param count
     */
    GetRange(index: number, count: number): List<T>;
    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the List<T> that extends from the specified index to the last element.
     * @param item
     * @param startIndex
     */
    IndexOf(item: T, startIndex?: number): number;
    /**
     * Returns the zero-based index of the last occurrence of a value in the List<T> or in a portion of it.
     * @param item
     * @param endIndex
     */
    LastIndexOf(item: T, endIndex?: number): number;
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param match
     */
    TrueForAll(match: (item: T) => boolean): boolean;
    /**
     * Sorts the elements or a portion of the elements in the List<T> using either the specified or default IComparer<T> implementation or a provided Comparison<T> delegate to compare list elements.
     * @param comparison
     */
    Sort(comparison?: (item: T) => any): void;
    /**
     * Inserts an element into the List<T> at the specified index.
     * @param index
     * @param item
     */
    Insert(index: number, item: T): void;
    /**
     * Inserts the elements of a collection into the List<T> at the specified index.
     * @param index
     * @param collection
     */
    InsertRange(index: number, collection: List<T>): void;
    /**
     * Removes the first occurrence of a specific object from the List<T>.
     * @param item
     */
    Remove(item: T): boolean;
    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param match
     */
    RemoveAll(match: (item: T) => boolean): number;
    /**
     * Removes the element at the specified index of the List<T>.
     * @param index
     */
    RemoveAt(index: number): void;
    /**
     * Removes a range of elements from the List<T>.
     * @param index
     * @param count
     */
    RemoveRange(index: number, count: number): void;
    /**
     * Reverses the order of the elements in the entire List<T>.
     */
    Reverse(): void;
    /**
     * Reverses the order of the elements in the specified range.
     * @param index
     * @param count
     */
    ReverseRange(index: number, count: number): void;
    private updateProperties;
}
