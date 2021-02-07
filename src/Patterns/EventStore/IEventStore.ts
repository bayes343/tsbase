import { Observable } from '../Observable/module';

export type Transaction<T> = {
  timestamp: number,
  path: string,
  toState: T,
  fromState?: T
};

/**
 * A light state management pattern allowing storage, retrieval, and
 * monitoring of state.
 */
export interface IEventStore<T> {
  /**
   * Returns a copy of the current state
   */
  GetState(): object & T;

  /**
   * Returns a portion of the state based on the given path
   * @param path object path to the desired state
   */
  GetStateAt<T>(path: string): T | undefined;

  /**
   *
   * @param state state to set
   * @param path object path to be set
   */
  SetStateAt<T>(state: T, path: string): T;

  /**
   * Returns an observable which can be subscribed to in order
   * to act on state changes
   * @param path object path to the desired state
   */
  ObservableAt<T>(path: string): Observable<T>;

  /**
   * Returns a collection of all the transactions which resulted
   * in the current state
   */
  GetLedger(): Array<Transaction<any>>;
}
