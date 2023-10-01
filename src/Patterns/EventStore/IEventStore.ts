import { Observable } from '../Observable/Observable';
import { Result } from '../Result/Result';
import { Transaction } from './Transaction';

/**
 * A light state management pattern allowing storage, retrieval, and
 * monitoring of state.
 */
export interface IEventStore<T> {
  /**
   * Returns a copy of the current state
   */
  GetState(): T;

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
  SetStateAt<T>(path: string, state: T): Result<T>;

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

  /**
   * Voids the most recent (non-voided) transaction, returning the
   * stores value to the previous 'from' state
   */
  Undo(): Result<T | undefined>;

  /**
   * Reverses the void on the newest voided transaction excluding any
   * voided transaction that follows a non-voided one
   * (Once state is set, prior voided transactions cannot be reversed)
   */
  Redo(): Result<T | undefined>;
}
