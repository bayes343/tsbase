import { Strings } from '../../../Constants/Strings';
import { Observable } from '../Observable';

describe('Observable', () => {
  let classUnderTest: Observable<string>;

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
});
