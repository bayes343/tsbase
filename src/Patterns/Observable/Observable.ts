import { Guid } from '../../Functions/Guid';
import { Command } from '../CommandQuery/Command';
import { IObservable } from './IObservable';

export class Observable<T> implements IObservable<T> {
  private subscribers = new Map<string, (content?: T) => void>();
  private active = true;

  public Subscribe(func: (content?: T) => void): string {
    const subscriptionId = Guid.NewGuid();
    this.subscribers.set(subscriptionId, func);
    return subscriptionId;
  }

  public Publish(content?: T): void {
    if (this.active) {
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
}
