import { Guid } from '../../Functions/Guid';
import { Command } from '../CommandQuery/Command';
import { IObservable } from './IObservable';

export class Observable<T> implements IObservable<T> {
  private subscribers = new Map<string, (content?: T) => void>();
  private active = true;
  private currentIssue?: T;

  public Subscribe(func: (content?: T) => void): string {
    const subscriptionId = Guid.NewGuid();
    this.subscribers.set(subscriptionId, func);

    if (this.currentIssue) {
      func(this.currentIssue);
    }

    return subscriptionId;
  }

  public Order(func: (content?: T) => void): void {
    const subscriptionId = Guid.NewGuid();

    const orderFunction = (content?: T) => {
      func(content);
      this.Cancel(subscriptionId);
    };

    this.subscribers.set(subscriptionId, orderFunction);

    if (this.currentIssue) {
      orderFunction(this.currentIssue);
    }
  }

  public Publish(content?: T): void {
    if (this.active) {
      this.currentIssue = content;

      for (const element of this.subscribers) {
        const key = element[0];
        const func = element[1];

        const result = new Command(() => func(content)).Execute();

        if (!result.IsSuccess) {
          this.subscribers.delete(key);
        }
      }
    }
  }

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
