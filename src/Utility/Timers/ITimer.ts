export interface ITimer {
  /**
   * Boolean indicating whether the Timer should raise the Elapsed event only once (false) or repeatedly (true).
   */
  AutoReset: boolean;

  /**
   * Boolean indicating whether the Timer should raise the Elapsed event.
   */
  Enabled: boolean;

  /**
   * The interval, expressed in milliseconds, at which to raise the Elapsed event.
   */
  Interval: number;

  /**
   * List of functions to be called on each time the interval specified elapses
   */
  Elapsed: Array<() => void>;

  /**
   * Starts raising the Elapsed event at the specified interval
   */
  Start(): Promise<any>;

  /**
   * Stops raising the Elapsed event by setting Enabled to false.
   */
  Stop(): void;
}
