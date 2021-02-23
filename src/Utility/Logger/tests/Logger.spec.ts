import { LogEntry } from '../LogEntry';
import { Logger } from '../Logger';

describe('Logger', () => {

  beforeEach(() => {
    Logger.Instance.LogEntries = [];
  });

  it('should expose a static array of entries', () => {
    expect(Logger.Instance.LogEntries).toBeDefined();
    expect(Logger.Instance.LogEntries.length).toEqual(0);
  });

  it('should expose a static observable of log entry', () => {
    expect(Logger.Instance.EntryLogged).toBeDefined();
  });

  it('should log a new entry', () => {
    const entry = new LogEntry('test');
    Logger.Instance.Log(entry);
    expect(Logger.Instance.LogEntries[0]).toEqual(entry);
  });

  it('should publish entry logged events with the new log entry', () => {
    let loggedEntry: LogEntry | undefined;
    const entry = new LogEntry('test');
    Logger.Instance.EntryLogged.Subscribe(entry => loggedEntry = entry);

    Logger.Instance.Log(entry);

    expect(loggedEntry).toEqual(entry);
  });
});
