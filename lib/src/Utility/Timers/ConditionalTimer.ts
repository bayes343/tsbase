import { IConditionalTimer, Condition, Action } from './IConditionalTimer';
import { Timer } from './Timer';
import { ITimer } from './ITimer';

/**
 * A timer that performs an action over time based on the evaluation of a condition
 */
export class ConditionalTimer implements IConditionalTimer {
  private timer: ITimer;

  constructor(timer?: ITimer) {
    this.timer = timer || new Timer(100);
  }

  /**
   * Short hand for creating a new instance of ConditionalTimer
   * @param interval 
   */
  public static Instance(interval?: number): ConditionalTimer {
    return new ConditionalTimer(new Timer(interval));
  }

  /**
   * Performs the given action one time after the condition evaluates to true
   * @param action 
   * @param condition 
   */
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

  /**
   * Performs the given action repeatedly until the condition evaluates to true
   * @param action 
   * @param condition 
   */
  public async DoUntil(action: Action, condition: Condition): Promise<void> {
    return this.getRepeatingConditionalTimer(action, condition);
  }

  /**
   * Performs the given action repeatedly as long as the condition evaluates to true
   * @param action 
   * @param condition 
   */
  public async DoWhile(action: Action, condition: Condition): Promise<void> {
    return this.getRepeatingConditionalTimer(action, () => !condition());
  }

  /**
   * Stops the underlying timer, preventing further execution
   */
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
