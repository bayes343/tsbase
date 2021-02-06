import dlv from 'dlv';
import { dset } from 'dset';
import { Strings } from '../../Functions/module';
import { Observable } from '../Observable/module';
import { IEventStore, Transaction } from './IEventStore';

export class EventStore implements IEventStore {
  private state = {};
  private stateObservers = new Map<string, Observable<any>>();
  private ledger = new Array<Transaction<any>>();

  public GetState<T>(): object & T {
    return this.cloneOf(this.state) as object & T;
  }

  public GetStateAt<T>(path: string): T | undefined {
    return this.cloneOf(dlv(this.state as object, path, null)) || undefined;
  }

  public SetStateAt<T>(value: T, path: string): T {
    const previousState = dlv(this.state, path);
    const stateClone = this.cloneOf<T>(value);
    this.ledger.push({
      path: path,
      timestamp: Date.now(),
      toState: stateClone,
      fromState: previousState
    });

    Strings.IsEmptyOrWhiteSpace(path) ? this.state = value : dset(this.state, path, value);
    this.ObservableAt(path).Publish(stateClone);
    this.publishToChildObservers(value, path);

    return stateClone;
  }

  public ObservableAt<T>(path: string): Observable<T> {
    if (!this.stateObservers.has(path)) {
      this.stateObservers.set(path, new Observable<T>());
    };

    return this.stateObservers.get(path) as Observable<T>;
  }

  public GetLedger(): Array<Transaction<any>> {
    return this.ledger.slice();
  }

  private cloneOf<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  private publishToChildObservers<T>(state: T, path: string): void {
    const observerKeys = Array.from(this.stateObservers.keys());
    const targetObserverKeys = Strings.IsEmptyOrWhiteSpace(path) ?
      observerKeys.filter(k => !Strings.IsEmptyOrWhiteSpace(k)) :
      observerKeys.filter(k => k.startsWith(`${path}.`));

    targetObserverKeys.forEach(key => {
      (this.stateObservers.get(key) as Observable<T>).Publish(state);
    });
  }
}
