import { IObservable } from './IObservable';

/**
 * Coordinates async subscriber actions with publish events
 */
export interface IAsyncObservable<T> extends IObservable<T> {
  /**
   * Specify an async function to fire on future publish events |
   * id returned allows caller to cancel subscription
   * @param func
   */
  Subscribe(func: (content?: T) => Promise<void>): Promise<string>;

  /**
   * A single issue subscription. Once the function for an
   * order fires, it is automatically canceled
   * @param useCurrentIssue Determines if the order can be filled by the current issue
   */
  Order(func: (content?: T) => Promise<void>, useCurrentIssue?: boolean): Promise<void>;
}
