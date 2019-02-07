export class Timer {
  /**
   * Boolean indicating whether the Timer should raise the Elapsed event only once (false) or repeatedly (true).
   */
  public AutoReset = false;
  /**
   * Boolean indicating whether the Timer should raise the Elapsed event.
   */
  public Enabled = false;
  /**
   * The interval, expressed in milliseconds, at which to raise the Elapsed event.
   */
  public Interval: number;
  /**
   * List of functions to be called on each time the interval specified elapses
   */
  public Elapsed = new Array<() => void>();

  /**
   * 	Initializes a new instance of the Timer class, and sets all the properties to their initial values.
   */
  constructor();
  constructor(interval?: number)
  constructor(interval?: any) {
    interval ? this.Interval = interval : this.Interval = 0;
  }

  /**
   * Starts raising the Elapsed event at the specified interval
   */
  public async Start(): Promise<any> {
    return await new Promise<any>((resolve) => {
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

  /**
   * Stops raising the Elapsed event by setting Enabled to false.
   */
  public Stop(): void {
    this.Enabled = false;
  }

}