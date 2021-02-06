import { Observable } from '../Observable/module';

export type Transaction<T> = {
  timestamp: number,
  path: string,
  toState: T,
  fromState?: T
};

export interface IEventStore {
  GetState<T>(): object & T;
  GetStateAt<T>(path: string): T | undefined;
  SetStateAt<T>(state: T, path: string): T;
  ObservableAt<T>(path: string): Observable<T>;
  GetLedger(): Array<Transaction<any>>;
}
