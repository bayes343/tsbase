import { LogEntry } from '../LogEntry';
import { Logger } from '../Logger';

describe('Logger', () => {

  beforeEach(() => {
    Logger.LogEntries = [];
  });

  it('should expose a static array of entries', () => {
    expect(Logger.LogEntries).toBeDefined();
    expect(Logger.LogEntries.length).toEqual(0);
  });

  it('should expose a static observable of log entry', () => {
    expect(Logger.EntryLogged).toBeDefined();
  });

  it('should log a new entry', () => {
    const entry = new LogEntry('test');
    Logger.Log(entry);
    expect(Logger.LogEntries[0]).toEqual(entry);
  });

  it('should publish entry logged events with the new log entry', () => {
    let loggedEntry: LogEntry | undefined;
    const entry = new LogEntry('test');
    Logger.EntryLogged.Subscribe(entry => loggedEntry = entry);

    Logger.Log(entry);

    expect(loggedEntry).toEqual(entry);
  });
});
