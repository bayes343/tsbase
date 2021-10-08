import dlv from 'dlv';
import { dset } from 'dset';
import { Queryable } from '../../Collections/Queryable';
import { Errors } from '../../Errors';
import { Strings } from '../../System/Strings';
import { Query } from '../CommandQuery/Query';
import { Observable } from '../Observable/Observable';
import { GenericResult } from '../Result/GenericResult';
import { Transaction } from './Transaction';
import { IEventStore } from './IEventStore';

export class EventStore<T> implements IEventStore<T> {
  private state = {};
  private stateObservers = new Map<string, Observable<any>>();
  private ledger = new Array<Transaction<any>>();

  public GetState(): T {
    return this.cloneOf(this.state) as T;
  }

  public GetStateAt<T>(path: string): T | undefined {
    return Strings.IsEmptyOrWhiteSpace(path) ?
      this.GetState() :
      this.cloneOf(dlv(this.state as object, path));
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

  public Undo(): GenericResult<T | undefined> {
    return new Query<T | undefined>(() => {
      const queryableLedger = Queryable.From(this.ledger);
      const lastVoidableTransaction = queryableLedger.Last(t => !t.voided);
      if (lastVoidableTransaction) {
        lastVoidableTransaction.voided = true;
        this.updateState(lastVoidableTransaction.path, lastVoidableTransaction.toState, lastVoidableTransaction.fromState, false);
      } else {
        throw new Error(Errors.NoTransactionToUndo);
      }

      return this.GetStateAt<T>(lastVoidableTransaction.path);
    }).Execute();
  }

  public Redo(): GenericResult<T | undefined> {
    return new Query<T | undefined>(() => {
      let lastRedoableTransaction: Transaction<T> | null = null;

      for (let index = this.ledger.length - 1; index >= 0; index--) {
        const element = this.ledger[index];
        if (!element.voided) {
          break;
        } else {
          lastRedoableTransaction = element;
        }
      }

      if (lastRedoableTransaction) {
        lastRedoableTransaction.voided = false;
        this.updateState(lastRedoableTransaction.path, lastRedoableTransaction.fromState, lastRedoableTransaction.toState, false);
      } else {
        throw new Error(Errors.NoTransactionToRedo);
      }

      return this.GetStateAt<T>(lastRedoableTransaction.path);
    }).Execute();
  }

  private cloneOf<T>(value: T): T {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  private updateState<T>(path: string, previousState: any, value: T, updateLedger = true) {
    if (updateLedger) {
      this.ledger.push({
        path: path,
        timestamp: Date.now(),
        toState: this.cloneOf(value),
        fromState: previousState,
        voided: false
      });
    }

    const rootUpdate = Strings.IsEmptyOrWhiteSpace(path);
    if (rootUpdate) {
      this.state = value || {};
    } else {
      dset(this.state, path, value);
    }

    this.publishToDependentObservers(path);
  }

  private publishToDependentObservers<T>(path: string): void {
    const targetObserverKeys = this.getTargetObservers(path);

    targetObserverKeys.forEach(key => {
      (this.stateObservers.get(key) as Observable<T>).Publish(
        Strings.IsEmptyOrWhiteSpace(key) ?
          this.GetState() :
          this.cloneOf(dlv(this.state, key)));
    });
  }

  private getTargetObservers(path: string): Array<string> {
    const observerKeys = Array.from(this.stateObservers.keys());
    return Strings.IsEmptyOrWhiteSpace(path) ? observerKeys :
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
