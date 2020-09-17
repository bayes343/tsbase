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
