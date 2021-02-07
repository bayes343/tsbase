import { Observable } from '../Observable/module';
import { GenericResult } from '../Result/GenericResult';

export type Transaction<T> = {
  timestamp: number,
  path: string,
  toState: T,
  fromState?: T,
  voided: boolean
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
   * Sets the state at a given path, returning a result indicating
   * success and a copy of the state set
   * @param state state to set
   * @param path object path to be set
   */
  SetStateAt<T>(state: T, path: string): GenericResult<T>;

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

  Undo(): GenericResult<T | undefined>;
  Redo(): GenericResult<T | undefined>;
}
