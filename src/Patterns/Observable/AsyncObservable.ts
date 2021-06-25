import { Guid } from '../../Functions/Guid';
import { AsyncCommand } from '../CommandQuery/AsyncCommand';
import { BaseObservable } from './BaseObservable';
import { IAsyncObservable } from './IAsyncObservable';

export class AsyncObservable<T> extends BaseObservable<T> implements IAsyncObservable<T> {
  public async Subscribe(func: (content?: T) => Promise<void>): Promise<string> {
    const subscriptionId = Guid.NewGuid();
    this.subscribers.set(subscriptionId, func);

    if (this.currentIssue) {
      await func(this.currentIssue);
    }

    return subscriptionId;
  }

  public async Order(func: (content?: T) => Promise<void>, useCurrentIssue = true): Promise<void> {
    const subscriptionId = Guid.NewGuid();

    const orderFunction = async (content?: T) => {
      await func(content);
      this.Cancel(subscriptionId);
    };

    this.subscribers.set(subscriptionId, orderFunction);

    if (useCurrentIssue && this.currentIssue) {
      await orderFunction(this.currentIssue);
    }
  }

  public async Publish(content?: T): Promise<void> {
    if (this.active) {
      this.currentIssue = content;

      for (const element of this.subscribers) {
        const key = element[0];
        const func = element[1];

        const result = await new AsyncCommand(async () => func(content)).Execute();

        if (!result.IsSuccess) {
          this.Cancel(key);
        }
      }
    }
  }
}
