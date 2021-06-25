import { Guid } from '../../Functions/Guid';
import { Command } from '../CommandQuery/Command';
import { BaseObservable } from './BaseObservable';
import { ISyncObservable } from './ISyncObservable';

export class Observable<T> extends BaseObservable<T> implements ISyncObservable<T> {
  public Subscribe(func: (content?: T) => void): string {
    const subscriptionId = Guid.NewGuid();
    this.subscribers.set(subscriptionId, func);

    if (this.currentIssue) {
      func(this.currentIssue);
    }

    return subscriptionId;
  }

  public Order(func: (content?: T) => void, useCurrentIssue = true): void {
    const subscriptionId = Guid.NewGuid();

    const orderFunction = (content?: T) => {
      func(content);
      this.Cancel(subscriptionId);
    };

    this.subscribers.set(subscriptionId, orderFunction);

    if (useCurrentIssue && this.currentIssue) {
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
          this.Cancel(key);
        }
      }
    }
  }
}
