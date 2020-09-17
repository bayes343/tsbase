import { Guid } from '../../Functions/Guid';
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
      this.subscribers.forEach(func => {
        func(content);
      });
    }
  }

  public Cancel(subscriptionId: string): void {
    this.subscribers.delete(subscriptionId);
  }

  public Discontinue(): void {
    this.active = false;
  }
}
