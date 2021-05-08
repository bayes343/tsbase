import { IObservable } from './IObservable';

export abstract class BaseObservable<T> implements IObservable<T> {
  protected subscribers = new Map<string, (content?: T) => void>();
  protected active = true;
  protected currentIssue?: T;

  public abstract Publish(content?: T): void;

  public Cancel(subscriptionId: string): void {
    this.subscribers.delete(subscriptionId);
  }

  public Discontinue(): void {
    this.active = false;
  }

  public Reinstate(): void {
    this.active = true;
  }
}
