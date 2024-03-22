import dlv from 'dlv';
import { dset } from 'dset';
import { Queryable } from '../../Collections/Queryable/Queryable';
import { Strings } from '../../System/Strings';
import { Query } from '../CommandQuery/Query';
import { Observable } from '../Observable/Observable';
import { Result } from '../Result/Result';
import { Transaction } from './Transaction';
import { IEventStore, MemberLambda } from './IEventStore';

export const StateChangeUnnecessary = 'State change unnecessary - nothing changed';
export const NoTransactionToUndo = 'No transaction to undo';
export const NoTransactionToRedo = 'No transaction to redo';

export class EventStore<T extends Object> implements IEventStore<T> {
  private stateObservers = new Map<string, Observable<any>>();
  private ledger = new Array<Transaction<any>>();

  constructor(
    private state: T
  ) { }

  public GetState<V>(member?: MemberLambda<T, V> | string) {
    if (typeof member === 'string') {
      return this.getStateAtPath(member);
    }

    const clone = this.cloneOf(this.state);
    return member ? member(clone) : clone;
  }

  public SetState<V>(memberOrState: MemberLambda<T, V> | string | T, state?: T): Result<V | T> {
    return new Query<V | T>(() => {
      const isGranularUpdate = ['function', 'string'].includes(typeof memberOrState) && state !== undefined;
      const getCurrentState = () => {
        if (isGranularUpdate && typeof memberOrState === 'function') {
          return memberOrState(this.cloneOf(this.state));
        } else if (isGranularUpdate && typeof memberOrState === 'string') {
          return this.getStateAtPath(memberOrState);
        } else {
          return this.cloneOf(this.state);
        }
      };
      const newState = isGranularUpdate ? state : memberOrState as V;

      if (JSON.stringify(getCurrentState()) !== JSON.stringify(newState)) {
        this.updateState(
          isGranularUpdate ? memberOrState as MemberLambda<T, V> | string : Strings.Empty,
          getCurrentState(),
          newState);
      } else {
        throw new Error(StateChangeUnnecessary);
      }

      return getCurrentState();
    }).Execute();
  }

  public ObservableAt<V>(member?: MemberLambda<T, V> | string): Observable<V> {
    const path = typeof member === 'string' ? member : this.getPathFromMemberFunction(member);
    if (!this.stateObservers.has(path)) {
      this.stateObservers.set(path, new Observable<V>());
    };

    return this.stateObservers.get(path) as Observable<V>;
  }

  public GetLedger(): Array<Transaction<any>> {
    return this.ledger.slice();
  }

  public Undo(): Result<T | undefined> {
    return new Query<T | undefined>(() => {
      const queryableLedger = Queryable.From(this.ledger);
      const lastVoidableTransaction = queryableLedger.Last(t => !t.voided);
      if (lastVoidableTransaction) {
        lastVoidableTransaction.voided = true;
        this.updateState(lastVoidableTransaction.path, lastVoidableTransaction.toState, lastVoidableTransaction.fromState, false);
      } else {
        throw new Error(NoTransactionToUndo);
      }

      return this.getStateAtPath(lastVoidableTransaction.path);
    }).Execute();
  }

  public Redo(): Result<T | undefined> {
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
        throw new Error(NoTransactionToRedo);
      }

      return this.getStateAtPath(lastRedoableTransaction.path);
    }).Execute();
  }

  private cloneOf<T>(value: T): T {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  private getPathFromMemberFunction<R>(member?: MemberLambda<T, R>): string {
    const regex = /[.][a-zA-Z0-9]*/g;
    let path = Strings.Empty;

    if (member) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(member.toString())) !== null) {
        const matchValue = path.length ? match[0] : match[0].replace('.', Strings.Empty);
        path += matchValue;
      }
    }

    return path;
  }

  private getStateAtPath(path: string): any {
    return this.cloneOf(dlv(this.state as object, path));
  }

  private updateState<V>(member: string | MemberLambda<T, V>, previousState: any, value: T | V, updateLedger = true) {
    if (typeof member !== 'string') {
      member = this.getPathFromMemberFunction(member);
    }

    if (updateLedger) {
      this.ledger.push({
        path: member,
        timestamp: Date.now(),
        toState: this.cloneOf(value),
        fromState: previousState,
        voided: false
      });
    }

    const rootUpdate = Strings.IsEmptyOrWhiteSpace(member.toString());
    if (rootUpdate) {
      this.state = value as T;
    } else {
      dset(this.state, member.toString(), value);
    }

    this.publishToDependentObservers(member);
  }

  private publishToDependentObservers(path: string): void {
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
