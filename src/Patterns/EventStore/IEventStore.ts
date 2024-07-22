import { Observable } from '../Observable/Observable';
import { Result } from '../Result/Result';
import { Transaction } from './Transaction';

export type MemberLambda<Store, Member> = (func: Store) => Member;

/**
 * A light state management pattern allowing storage, retrieval, and
 * monitoring of state.
 */
export interface IEventStore<T extends object> {
  /**
   * Returns a copy of the current state
   */
  GetState(): T;

  /**
   * Returns a portion of the state based on the given path
   * @param path object path to the desired state
   */
  GetState<V>(member: MemberLambda<T, V> | string): V;

  /**
   * Update the current state of the entire store
   * @param state state to set at a root level
   */
  SetState<T>(state: T): Result<T>;

  /**
   * Sets the state at a given path, returning a result indicating
   * success and a copy of the state set
   * @param state state to set
   * @param path object path to be set
   */
  SetState<V>(member: MemberLambda<T, V> | string, state: V): Result<V>;

  /**
   * Returns an observable which can be subscribed to in order
   * to act on ANY state changes within the store
   */
  ObservableAt(): Observable<T>;

  /**
   * Returns an observable which can be subscribed to in order
   * to act on state changes
   * @param path object path to the desired state
   */
  ObservableAt<V>(member: MemberLambda<T, V> | string): Observable<V>;

  /**
   * Returns a collection of all the transactions which resulted
   * in the current state
   */
  GetLedger(): Array<Transaction<T>>;

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
