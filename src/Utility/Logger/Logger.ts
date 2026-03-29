/* eslint-disable no-console */
import { Observable } from '../../Patterns/Observable/Observable';
import { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';

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

  /**
   * Forwards log entries to console via standard console api - useful for debugging and dev envs
   */
  public static DisplayLogsInConsole() {
    Logger.Instance.EntryLogged.Subscribe((le) => {
      le?.Level === LogLevel.Info && console.log(le.Message);
      le?.Level === LogLevel.Warn && console.warn(le.Message);
      le?.Level === LogLevel.Error && console.error(le.Message);
    });
  }
}
