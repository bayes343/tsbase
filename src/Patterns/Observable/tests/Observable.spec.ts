import { Strings } from '../../../System/Strings';
import { Observable } from '../Observable';

class TestClass {
  name = Strings.Empty;
}

describe('Observable', () => {
  let classUnderTest: Observable<any>;

  beforeEach(() => {
    classUnderTest = new Observable<string>();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should call alls subscribers when published to', () => {
    let firstSubscriber = 'one';
    let secondSubscriber = 'one';
    classUnderTest.Subscribe((content) => {
      firstSubscriber = content || Strings.Empty;
    });
    classUnderTest.Subscribe((content) => {
      secondSubscriber = content || Strings.Empty;
    });
    const newWord = 'two';

    classUnderTest.Publish(newWord);

    expect(firstSubscriber).toEqual(newWord);
    expect(secondSubscriber).toEqual(newWord);
  });

  it('should cancel an existing subscription', () => {
    let subscriber = 'one';
    const id = classUnderTest.Subscribe((content) => {
      subscriber = content || Strings.Empty;
    });

    classUnderTest.Cancel(id);
    classUnderTest.Publish('two');

    expect(subscriber).toEqual('one');
  });

  it('should discontinue future calls to subscribers on publish', () => {
    let subscriber = 'one';
    classUnderTest.Subscribe((content) => {
      subscriber = content || Strings.Empty;
    });

    classUnderTest.Discontinue();
    classUnderTest.Publish('two');

    expect(subscriber).toEqual('one');
  });

  it('should reinstate a subscription that was discontinued', () => {
    let subscriber = 'one';
    classUnderTest.Subscribe((content) => {
      subscriber = content || Strings.Empty;
    });
    classUnderTest.Discontinue();

    classUnderTest.Reinstate();
    classUnderTest.Publish('two');

    expect(subscriber).toEqual('two');
  });

  it('should gracefully handle a subscriber that is no longer defined', () => {
    classUnderTest = new Observable<TestClass>();
    let subscriberValue = 'john';
    let subscriber: TestClass | undefined = new TestClass();
    subscriber.name = subscriberValue;
    (classUnderTest as Observable<TestClass>).Subscribe((content) => {
      subscriber!.name = content!.name || Strings.Empty;
      subscriberValue = subscriber!.name;
    });
    subscriber = undefined;
    const newContent = new TestClass();
    newContent.name = 'jane';

    classUnderTest.Publish(newContent);

    expect(subscriberValue).toEqual('john');
  });

  it('should immediately call new subscribers when content from last publish is available', () => {
    classUnderTest = new Observable<string>();
    classUnderTest.Publish('test');
    let immediateValue = Strings.Empty;

    classUnderTest.Subscribe((content: string) => immediateValue = content);

    expect(immediateValue).toEqual('test');
  });

  it('should not immediately call new subscribers when content from last publish is not available', () => {
    classUnderTest = new Observable<string>();
    let immediateValue = Strings.Empty;

    classUnderTest.Subscribe((content: string) => immediateValue = content);

    expect(immediateValue).toEqual(Strings.Empty);
  });

  it('should call an order subscriber once but not more than once', () => {
    classUnderTest = new Observable<string>();
    let immediateValue = Strings.Empty;

    classUnderTest.Order((content: string) => immediateValue = content);
    classUnderTest.Publish('test');
    classUnderTest.Publish('another-test');

    expect(immediateValue).toEqual('test');
  });

  it('should call an order subscriber immediately if previously published content is available', () => {
    classUnderTest = new Observable<string>();
    let immediateValue = Strings.Empty;
    classUnderTest.Publish('test');

    classUnderTest.Order((content: string) => immediateValue = content);
    classUnderTest.Publish('another-test');

    expect(immediateValue).toEqual('test');
  });

  it('should not call an order subscriber immediately if given false for useCurrentIssue', () => {
    classUnderTest = new Observable<string>();
    let immediateValue = Strings.Empty;
    classUnderTest.Publish('test');

    classUnderTest.Order((content: string) => immediateValue = content, false);

    expect(immediateValue).toEqual(Strings.Empty);
  });
});
