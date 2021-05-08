/**
 * Coordinates subscriber actions with publish events
 */
export interface IObservable<T> {
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

  /**
   * Resumes calling subscribers on publish events
   */
  Reinstate(): void;
}
