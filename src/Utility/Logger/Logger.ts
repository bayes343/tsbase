import { Observable } from '../../Patterns/Observable/Observable';
import { LogEntry } from './LogEntry';

export class Logger {
  /**
   * All logs collected during the current application lifecycle
   */
  public static LogEntries = new Array<LogEntry>();

  /**
   * Observable that is published to upon logging a new entry
   */
  public static EntryLogged = new Observable<LogEntry>();

  /**
   * Log a new entry
   * @param entry
   */
  public static Log(entry: LogEntry): void {
    Logger.LogEntries.push(entry);
    Logger.EntryLogged.Publish(entry);
  }
}
