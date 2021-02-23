import { Observable } from '../../Patterns/Observable/Observable';
import { LogEntry } from './LogEntry';

export class Logger {
  private static instance: Logger | null = null;
  public static get Instance(): Logger {
    return this.instance || (this.instance = new Logger());
  }

  /**
   * All logs collected during the current application lifecycle
   */
  public LogEntries = new Array<LogEntry>();

  /**
   * Observable that is published to upon logging a new entry
   */
  public EntryLogged = new Observable<LogEntry>();

  private constructor() { }

  /**
   * Log a new entry
   * @param entry
   */
  public Log(entry: LogEntry): void {
    Logger.Instance.LogEntries.push(entry);
    Logger.Instance.EntryLogged.Publish(entry);
  }
}
