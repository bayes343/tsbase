import { LogLevel } from './LogLevel';

export class LogEntry {
  public Timestamp = Date.now();

  constructor(
    public Message: string,
    public Level = LogLevel.Info,
    public Error?: Error
  ) { }
};
