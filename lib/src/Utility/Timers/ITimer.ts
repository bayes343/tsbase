export interface ITimer {
  AutoReset: boolean;
  Enabled: boolean;
  Interval: number;
  Elapsed: Array<() => void>;
  Start(): Promise<any>;
  Stop(): void;
}
