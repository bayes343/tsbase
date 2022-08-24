import { Mock } from 'tsmockit';
import { Until } from '../../Timers/Until';
import { ISpeechRecognition, SpeechRecognitionEvents } from '../ISpeechRecognition';
import { ISpeechRecognizer } from '../ISpeechRecognizer';
import { SpeechRecognizer } from '../SpeechRecognizer';

describe('SpeechRecognizer', () => {
  const mockSpeechRecognition = new Mock<ISpeechRecognition>();
  let classUnderTest: ISpeechRecognizer;
  let resultSub: ((e: any) => void) | null;
  let endSub: (() => void) | null;

  beforeEach(() => {
    resultSub = null;
    endSub = null;

    mockSpeechRecognition.Setup(sr => sr.start());
    mockSpeechRecognition.Setup(sr => sr.stop());
    mockSpeechRecognition.Setup(sr => sr.addEventListener, (type: SpeechRecognitionEvents, event: (e?: any) => void) => {
      if (type === SpeechRecognitionEvents.Result) {
        resultSub = event;
      } else if (type === SpeechRecognitionEvents.End) {
        endSub = event;
      }
    });
    mockSpeechRecognition.Setup(sr => sr.removeEventListener(SpeechRecognitionEvents.Result, {} as any));

    classUnderTest = new SpeechRecognizer(mockSpeechRecognition.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new SpeechRecognizer()).toBeDefined();
  });

  it('should throw an error if speech recognition is not set', () => {
    expect(() => {
      new SpeechRecognizer(null);
    }).toThrowError('No speech recognition service is available.');
  });

  it('should listen for a single transcript', async () => {
    const fakeTranscript = 'fake transcript';
    Until(() => (!!resultSub && !!endSub), 10, 1000).then(() => {
      resultSub?.({ results: [[{ transcript: fakeTranscript }]] });
      endSub?.();
    });

    const transcript = await classUnderTest.Listen();

    expect(transcript).toEqual(fakeTranscript);
  });

  it('should handle speech commands until a condition is met', async () => {
    const fakeTranscript = 'fake transcript';
    Until(() => (!!resultSub && !!endSub), 10, 1000).then(() => {
      resultSub?.({ results: [[{ transcript: fakeTranscript }]] });
      endSub?.();
    });
    let stopHandling = false;

    await classUnderTest.HandleSpeechCommands([
      {
        Condition: (t) => t === fakeTranscript,
        Action: async () => { stopHandling = true; }
      }
    ], () => stopHandling);

    expect(stopHandling).toBeTruthy();
  });
});
