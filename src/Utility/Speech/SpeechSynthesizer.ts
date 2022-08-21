import { ISpeechSynthesizer } from './ISpeechSynthesizer';

export class SpeechSynthesizer implements ISpeechSynthesizer {
  constructor(
    private ss: SpeechSynthesis = speechSynthesis
  ) {
    if (!ss) {
      throw new Error('Speech synthesis is unavailable on this device.');
    }
  }

  public async Speak(
    phrase: string | SpeechSynthesisUtterance,
    voice?: SpeechSynthesisVoice,
    utteranceFactory: (phrase: string) => SpeechSynthesisUtterance = (phrase) => new SpeechSynthesisUtterance(phrase)
  ): Promise<void> {
    return new Promise((resolve) => {
      const utterance = typeof phrase === 'string' ?
        utteranceFactory(phrase) : phrase;
      utterance.voice = utterance.voice || voice || this.ss.getVoices()[0];
      utterance.onend = () => resolve();
      this.ss.speak(utterance);
    });
  }
}
