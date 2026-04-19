const logSpy = jest.spyOn(console, 'log');
const warnSpy = jest.spyOn(console, 'warn');
const errorSpy = jest.spyOn(console, 'error');
import { LogEntry } from '../LogEntry';
import { Logger } from '../Logger';
import { LogLevel } from '../LogLevel';

describe('Logger', () => {
  beforeEach(() => {
    Logger.Instance.LogEntries = [];
  });

  afterAll(() => {
    logSpy.mockRestore();
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

  it('DisplayLogsInConsole should cause log entries to be logged via console methods', () => {
    const entry = new LogEntry('test');

    Logger.DisplayLogsInConsole();
    Logger.Instance.Log(entry);

    expect(logSpy).toHaveBeenCalledWith('test');
  });

  it('DisplayLogsInConsole should only log entries greater than or equal to given log level', () => {
    Logger.DisplayLogsInConsole(LogLevel.Error);
    Logger.Instance.LogInfo('info');
    Logger.Instance.LogInfo('info');
    Logger.Instance.LogWarning('warn');
    Logger.Instance.LogError('error');
    Logger.Instance.LogWarning('warn');
    Logger.Instance.LogInfo('info');

    expect(logSpy).not.toHaveBeenCalledWith('info');
    expect(warnSpy).not.toHaveBeenCalledWith('warn');
    expect(errorSpy).toHaveBeenCalledWith('error');
  });
});
