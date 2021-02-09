import { Observable } from '../../Patterns/Observable/Observable';
import { LogEntry } from './LogEntry';

export class Logger {
  public static LogEntries = new Array<LogEntry>();
  public static EntryLogged = new Observable<LogEntry>();

  public static Log(entry: LogEntry): void {
    Logger.LogEntries.push(entry);
    Logger.EntryLogged.Publish(entry);
  }
}
