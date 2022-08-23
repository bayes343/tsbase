import { Mock } from 'tsmockit';
import { ISpeechRecognition } from '../ISpeechRecognition';
import { ISpeechRecognizer } from '../ISpeechRecognizer';
import { SpeechRecognizer } from '../SpeechRecognizer';

describe('SpeechRecognizer', () => {
  const mockSpeechRecognition = new Mock<ISpeechRecognition>();
  let classUnderTest: ISpeechRecognizer;

  beforeEach(() => {
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
});
