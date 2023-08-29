import { Mock, Times } from 'tsmockit';
import { Until } from '../../Timers/Until';
import { ISpeechSynthesizer } from '../ISpeechSynthesizer';
import { SpeechSynthesizer } from '../SpeechSynthesizer';

describe('SpeechSynthesizer', () => {
  const testPhrase = 'this is a test';
  const defaultVoice = 'default voice' as unknown as SpeechSynthesisVoice;
  let fakeUtterance = {} as SpeechSynthesisUtterance;
  const fakeUtteranceFactory = (_phrase: string) => fakeUtterance;
  let mockSpeechSynthesis: Mock<SpeechSynthesis>;
  let classUnderTest: ISpeechSynthesizer;

  beforeEach(() => {
    mockSpeechSynthesis = new Mock<typeof speechSynthesis>();
    mockSpeechSynthesis.Setup(ss => ss.getVoices(), [defaultVoice]);
    fakeUtterance = {} as SpeechSynthesisUtterance;

    classUnderTest = new SpeechSynthesizer(mockSpeechSynthesis.Object);
  });

  it('should construct with default parameters', () => {
    expect(() => {
      new SpeechSynthesizer();
    }).toThrowError('Speech synthesis is unavailable on this device.');;
  });

  it('should throw an error when constructing if speechSynthesizer is undefined', () => {
    expect(() => {
      new SpeechSynthesizer(null as any);
    }).toThrowError('Speech synthesis is unavailable on this device.');
  });

  it('should speak a string phrase with the first available voice when no voice is given', async () => {
    mockSpeechSynthesis.Setup(ss => ss.speak(fakeUtterance));
    Until(() => !!fakeUtterance.onend, 10, 1000).then(() => fakeUtterance.onend?.({} as any));

    await classUnderTest.Speak(testPhrase, undefined, fakeUtteranceFactory);

    expect(fakeUtterance.voice).toEqual(defaultVoice);
    mockSpeechSynthesis.Verify(ss => ss.speak(fakeUtterance), Times.Once);
  });

  it('should speak a string phrase when the given voice', async () => {
    const givenVoice = 'given voice' as unknown as SpeechSynthesisVoice;
    mockSpeechSynthesis.Setup(ss => ss.speak(fakeUtterance));
    Until(() => !!fakeUtterance.onend, 10, 1000).then(() => fakeUtterance.onend?.({} as any));

    await classUnderTest.Speak(testPhrase, givenVoice, fakeUtteranceFactory);

    expect(fakeUtterance.voice).toEqual(givenVoice);
    mockSpeechSynthesis.Verify(ss => ss.speak(fakeUtterance), Times.Once);
  });

  it('should speak an utterance phrase', async () => {
    mockSpeechSynthesis.Setup(ss => ss.speak(fakeUtterance));
    Until(() => !!fakeUtterance.onend, 10, 1000).then(() => fakeUtterance.onend?.({} as any));

    await classUnderTest.Speak(fakeUtterance, undefined, fakeUtteranceFactory);

    expect(fakeUtterance.voice).toEqual(defaultVoice);
    mockSpeechSynthesis.Verify(ss => ss.speak(fakeUtterance), Times.Once);
  });
});
