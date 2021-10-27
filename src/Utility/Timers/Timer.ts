import { ITimer } from './ITimer';

export class Timer implements ITimer {
  public AutoReset = false;
  public Enabled = false;
  public Interval: number;
  public Elapsed = new Array<() => void>();

  constructor(interval?: number)
  constructor(interval?: any) {
    interval ? this.Interval = interval : this.Interval = 0;
  }

  public async Start(): Promise<void> {
    return await new Promise<void>((resolve) => {
      this.Enabled = this.Elapsed.length >= 1;

      const executer = setInterval(async () => {
        this.Elapsed.forEach(item => item());
        if (!this.AutoReset) {
          this.Enabled = false;
        }
        if (!this.Enabled) {
          clearInterval(executer);
          resolve();
        }
      }, this.Interval);
    });
  }

  public Stop(): void {
    this.Enabled = false;
  }
}
