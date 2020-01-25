import { IConditionalTimer, Condition, Action } from './IConditionalTimer';
import { Timer } from './Timer';
import { ITimer } from './ITimer';

export class ConditionalTimer implements IConditionalTimer {
  private timer: Timer;

  constructor(timer?: ITimer) {
    this.timer = timer || new Timer(100);
  }

  public async DoWhen(action: Action, condition: Condition): Promise<void> {
    this.resetTimer();

    return await new Promise<any>(async (resolve) => {
      this.timer.Elapsed.push(() => {
        if (condition()) {
          action();
          this.resetTimer();
          resolve();
        }
      });

      await this.timer.Start();
    });

  }

  public async DoUntil(action: Action, condition: Condition): Promise<void> {
    return this.getRepeatingConditionalTimer(action, condition);
  }

  public async DoWhile(action: Action, condition: Condition): Promise<void> {
    return this.getRepeatingConditionalTimer(action, () => !condition());
  }

  public Stop(): void {
    this.timer.Stop();
  }

  private async getRepeatingConditionalTimer(action: Action, condition: Condition): Promise<void> {
    this.resetTimer();

    return await new Promise<any>(async (resolve) => {
      this.timer.Elapsed.push(() => {
        action();
        if (condition()) {
          this.resetTimer();
          resolve();
        }
      });
      await this.timer.Start();
    });
  }


  private resetTimer(): void {
    if (this.timer.Enabled) {
      this.Stop();
      this.timer.AutoReset = true;
      this.timer.Elapsed = [];
    }
  }

}
