/* eslint-disable no-console */
import { Observable } from '../../Patterns/Observable/Observable';
import { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';

export class Logger {
  private static consoleEntryLoggedSubscription?: string;
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
   * Log at the info level
   * @param message
   */
  public LogInfo(message: string): void {
    this.Log(new LogEntry(message, LogLevel.Info));
  }

  /**
   * Log at the warn level
   * @param message
   */
  public LogWarning(message: string): void {
    this.Log(new LogEntry(message, LogLevel.Warn));
  }

  /**
   * Log at the error level
   * @param message
   * @param error
   */
  public LogError(message: string, error?: Error): void {
    this.Log(new LogEntry(message, LogLevel.Error, error));
  }

  private static readonly logLevelConsoleMethodMap: Record<LogLevel, typeof console.log | typeof console.warn | typeof console.error> = {
    [LogLevel.Info]: console.log,
    [LogLevel.Warn]: console.warn,
    [LogLevel.Error]: console.error
  };

  /**
   * Forwards log entries to console via standard console api - useful for debugging and dev envs
   */
  public static DisplayLogsInConsole(
    logLevel = LogLevel.Info
  ) {
    Logger.consoleEntryLoggedSubscription && Logger.Instance.EntryLogged.Cancel(Logger.consoleEntryLoggedSubscription);

    const logLevelValueMap: Record<LogLevel, number> = {
      [LogLevel.Info]: 0,
      [LogLevel.Warn]: 1,
      [LogLevel.Error]: 2
    };
    const logLevelValue = logLevelValueMap[logLevel];

    Logger.consoleEntryLoggedSubscription = Logger.Instance.EntryLogged.Subscribe((le) => {
      if (le && logLevelValueMap[le.Level] >= logLevelValue) {
        console.log(logLevelValueMap[le.Level], logLevelValue);
        Logger.logLevelConsoleMethodMap[le.Level](le.Message);
      }
    });
  }
}
