import { IObservable } from './IObservable';

/**
 * Coordinates subscriber actions with publish events
 */
export interface ISyncObservable<T> extends IObservable<T> {
  /**
   * Specify a function to fire on future publish events |
   * id returned allows caller to cancel subscription
   * @param func
   */
  Subscribe(func: (content?: T) => void, useCurrentIssue?: boolean): string;

  /**
   * A single issue subscription. Once the function for an
   * order fires, it is automatically canceled
   * @param useCurrentIssue Determines if the order can be filled by the current issue
   */
  Order(func: (content?: T) => void, useCurrentIssue?: boolean): void;
}
