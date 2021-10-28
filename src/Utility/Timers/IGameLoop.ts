import { Observable } from '../../Patterns/Observable/Observable';

/**
 * An object which supports the execution of a collection of events repeatedly
 * at a desired 'framerate' (times per second)
 */
export interface IGameLoop {
  /**
   * Observable which pushes the achieved framerate to subscribers
   */
  Framerate: Observable<number>;

  /**
   * The collection of events to be triggered at the given framerate
   */
  GameEvents: Array<Observable<any>>;

  /**
   * Initiates the triggering of events at the given framerate
   * @param framerate times per second events should be triggered
   */
  Start(framerate: number): void;

  /**
   * Ceases the triggering of events
   */
  Stop(): void;
}
