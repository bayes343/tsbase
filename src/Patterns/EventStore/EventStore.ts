import dlv from 'dlv';
import { dset } from 'dset';
import { Errors } from '../../Errors';
import { Strings } from '../../Functions/Strings';
import { Query } from '../CommandQuery/Query';
import { Observable } from '../Observable/Observable';
import { GenericResult } from '../Result/GenericResult';
import { IEventStore, Transaction } from './IEventStore';

export class EventStore<T> implements IEventStore<T> {
  private state = {};
  private stateObservers = new Map<string, Observable<any>>();
  private ledger = new Array<Transaction<any>>();

  public GetState(): object & T {
    return this.cloneOf(this.state) as object & T;
  }

  public GetStateAt<T>(path: string): T | undefined {
    return this.cloneOf(dlv(this.state as object, path, null)) || undefined;
  }

  public SetStateAt<T>(value: T, path: string): GenericResult<T> {
    return new Query<T>(() => {
      const previousState = dlv(this.state, path);

      if (JSON.stringify(previousState) !== JSON.stringify(value)) {
        this.updateState<T>(path, previousState, value);
      } else {
        throw new Error(Errors.StateChangeUnnecessary);
      }

      return this.cloneOf(value);
    }).Execute();
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

  private updateState<T>(path: string, previousState: any, value: T) {
    this.ledger.push({
      path: path,
      timestamp: Date.now(),
      toState: this.cloneOf(value),
      fromState: previousState
    });

    const rootUpdate = Strings.IsEmptyOrWhiteSpace(path);
    if (rootUpdate) {
      this.state = value;
    } else {
      dset(this.state, path, value);
    }

    this.publishToDependentObservers(path);
  }

  private publishToDependentObservers<T>(path: string): void {
    const targetObserverKeys = this.getTargetObservers(path);

    targetObserverKeys.forEach(key => {
      (this.stateObservers.get(key) as Observable<T>).Publish(
        this.cloneOf(dlv(this.state, key, null)));
    });
  }

  private getTargetObservers(path: string): Array<string> {
    const observerKeys = Array.from(this.stateObservers.keys());
    return Strings.IsEmptyOrWhiteSpace(path) ?
      observerKeys.filter(k => !Strings.IsEmptyOrWhiteSpace(k)) :
      observerKeys.filter(k =>
        k === Strings.Empty ||
        k === path ||
        this.childOf(k, path) ||
        this.parentOf(k, path));
  }

  private childOf(parentPath: string, childPath: string): boolean {
    return parentPath.startsWith(`${childPath}.`) ||
      parentPath.startsWith(`.${childPath}`) ||
      parentPath.indexOf(`.${childPath}.`) >= 0;
  }

  private parentOf(parentPath: string, childPath: string): boolean {
    return childPath.startsWith(`${parentPath}.`) ||
      childPath.startsWith(`.${parentPath}`) ||
      childPath.indexOf(`.${parentPath}.`) >= 0;
  }
}
