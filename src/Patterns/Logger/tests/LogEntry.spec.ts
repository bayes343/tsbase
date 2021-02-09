import { LogEntry } from '../LogEntry';
import { LogLevel } from '../LogLevel';

describe('LogEntry', () => {
  let classUnderTest: LogEntry;
  const message = 'test message';

  beforeEach(() => {
    classUnderTest = new LogEntry(message);
  });

  it('should construct a log entry with a default level of info and a defined timestamp', () => {
    expect(classUnderTest).toBeDefined();
    expect(classUnderTest.Message).toEqual(message);
    expect(classUnderTest.Level).toEqual(LogLevel.Info);
    expect(classUnderTest.Timestamp).toBeDefined();
  });

  it('should construct with all params', () => {
    const level = LogLevel.Error;
    const error = new Error();

    classUnderTest = new LogEntry(message, level, error);

    expect(classUnderTest.Message).toEqual(message);
    expect(classUnderTest.Level).toEqual(level);
    expect(classUnderTest.Timestamp).toBeDefined();
    expect(classUnderTest.Error).toEqual(error);
  });
});
