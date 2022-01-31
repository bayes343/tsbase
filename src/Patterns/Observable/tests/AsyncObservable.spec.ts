import { AsyncObservable } from '../AsyncObservable';
import { IAsyncObservable } from '../IAsyncObservable';

describe('AsyncObservable', () => {
  let classUnderTest: IAsyncObservable<number>;

  beforeEach(() => {
    classUnderTest = new AsyncObservable();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should subscribe to new publish events', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    classUnderTest.Subscribe(async (v) => {
      actualValue = v || 0;
    });
    await classUnderTest.Publish(expectedValue);

    expect(actualValue).toEqual(expectedValue);
  });

  it('should execute on subscription if current issue is available', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    await classUnderTest.Publish(expectedValue);
    classUnderTest.Subscribe(async (v) => {
      actualValue = v || 0;
    });

    expect(actualValue).toEqual(expectedValue);
  });

  it('should order ONLY the first available issue when none is currently available', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    classUnderTest.Order(async (v) => {
      actualValue = v || 0;
    });
    await classUnderTest.Publish(expectedValue);
    await classUnderTest.Publish(2);

    expect(actualValue).toEqual(expectedValue);
  });

  it('should order and take the current issue one is available', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    await classUnderTest.Publish(expectedValue);
    classUnderTest.Order(async (v) => {
      actualValue = v || 0;
    });

    expect(actualValue).toEqual(expectedValue);
  });

  it('should order the next issue event if one is available when false is passed to current issue arg', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    await classUnderTest.Publish(2);
    classUnderTest.Order(async (v) => {
      actualValue = v || 0;
    }, false);
    await classUnderTest.Publish(expectedValue);

    expect(actualValue).toEqual(expectedValue);
  });

  it('should subscribe to the next issue event if one is available when false is passed to current issue arg', async () => {
    const expectedValue = 1;
    let actualValue = 0;

    await classUnderTest.Publish(2);
    classUnderTest.Subscribe(async (v) => {
      actualValue = v || 0;
    }, false);
    await classUnderTest.Publish(expectedValue);

    expect(actualValue).toEqual(expectedValue);
  });

  it('should discontinue future calls to subscribers on publish', async () => {
    let subscriber = 1;
    classUnderTest.Subscribe(async content => {
      subscriber = content || 0;
    });

    classUnderTest.Discontinue();
    await classUnderTest.Publish(2);

    expect(subscriber).toEqual(1);
  });

  it('should cancel a subscription on error', async () => {
    const subId = await classUnderTest.Subscribe(async () => {
      throw new Error('test');
    });
    expect((classUnderTest as unknown as AsyncObservable<number>)['subscribers']
      .has(subId)).toBeTruthy();

    await classUnderTest.Publish(1);
    expect((classUnderTest as unknown as AsyncObservable<number>)['subscribers']
      .has(subId)).toBeFalsy();
  });
});
