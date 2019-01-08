import { List } from '../Collections/Generic/List';
export declare abstract class Enumerable<T> {
    /**
     * Enumerable implementation
     */
    Item: Array<T>;
    /**
     * Each extender should define how it should be cloned *structurally* - allows functional chaining of a data structure that maintains state
     * @param item
     */
    protected abstract Clone(item: Array<T>): Enumerable<T>;
    /**
     * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
     * @param seed
     * @param func
     */
    Aggregate<TResult, TAccumulate>(seed: TAccumulate, func: (current: TAccumulate, next: T) => TAccumulate, resultSelector: (item: TAccumulate) => TResult): TResult;
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     * @param func
     */
    All(func: (item: T) => boolean): boolean;
    /**
     * Determines whether any element of a sequence exists or satisfies a condition.
     * @param func
     */
    Any(func: (item: T) => boolean): boolean;
    /**
     * Computes the average of a sequence of numeric values, or the average result of the given function
     * @param func
     */
    Average(func?: (item: T) => any): number;
    /**
     * Computes the sum of a sequence of numeric values, or the sum result of the given function
     * @param func
     */
    Sum(func?: (item: T) => number): number;
    /**
     * Filters a sequence of values based on a predicate.
     * @param func
     */
    Where(func: (item: T) => boolean): Enumerable<T>;
    /**
     * Sorts the elements of a sequence in ascending order based on the default comparer or user defined function(s)
     * @param funcs
     */
    OrderBy(funcs?: Array<(item: T) => any>): Enumerable<T>;
    /**
     * Sorts the elements of a sequence in descending order.
     * @param func
     */
    OrderByDescending(funcs?: Array<(item: T) => any>): Enumerable<T>;
    /**
     * Creates a List<T> from an IEnumerable<T>.
     */
    ToList(): List<T>;
    /**
     * Creates an array from a IEnumerable<T>.
     */
    ToArray(): Array<T>;
    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count
     */
    Take(count: number): Enumerable<T>;
    /**
     * Returns elements from a sequence as long as a specified condition is true.
     * @param func
     */
    TakeWhile(func: (item: T) => boolean): Enumerable<T>;
    /**
     * Returns distinct elements from a sequence.
     * @param func
     */
    Distinct(): Enumerable<T>;
    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count
     */
    Skip(count: number): Enumerable<T>;
    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param func
     */
    SkipWhile(func: (item: T) => boolean): Enumerable<T>;
}
