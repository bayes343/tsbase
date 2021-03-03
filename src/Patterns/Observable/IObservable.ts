/**
 * Coordinates subscriber actions with publish events
 */
export interface IObservable<T> {
  /**
   * Specify a function to fire on future publish events |
   * id returned allows caller to cancel subscription
   * @param func
   */
  Subscribe(func: (content?: T) => void): string;

  /**
   * A single issue subscription. Once the function for an
   * order fires, it is automatically canceled
   * @param useCurrentIssue Determines if the order can be filled by the current issue
   */
  Order(func: (content?: T) => void, useCurrentIssue: boolean): void;

  /**
   * Signal a publish event to subscribers with the given content
   * @param content
   */
  Publish(content?: T): void;

  /**
   * Cancel an existing subscription by passing the id returned
   * in the subscribe call
   * @param subscriptionId
   */
  Cancel(subscriptionId: string): void;

  /**
   * Prevents future publish events from calling subscribers
   */
  Discontinue(): void;
}
