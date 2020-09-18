import { Strings } from '../../../Constants/Strings';
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
});
