import { Timer } from "../Timer";

describe('Timer', () => {
  let classUnderTest: Timer;

  beforeEach(() => {
    classUnderTest = new Timer();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new Timer(10)).toBeDefined();
  });

  it('should fire at given intervals', async () => {
    classUnderTest.Interval = 1;
    classUnderTest.Elapsed.push(() => { const stub = 'stub'; });
    await classUnderTest.Start();
    expect(classUnderTest.Enabled).toBeFalsy();
  })

  it('should stop an enabled timer', () => {
    classUnderTest.Interval = 1;
    classUnderTest.Elapsed.push(() => { const fake = 'fake'; });
    classUnderTest.AutoReset = true;
    classUnderTest.Start();
    classUnderTest.Stop();
    expect(classUnderTest.Enabled).toBeFalsy();
  });
});

