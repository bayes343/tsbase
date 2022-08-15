/**
 * Provides an interface for synthesizing speech
 */
export interface ISpeechSynthesizer {
  /**
   * Asynchronously synthesize the given phrase or utterance in the configured or specified voice
   * @param phrase
   * @param voice
   */
  Speak(phrase: string | SpeechSynthesisUtterance, voice?: SpeechSynthesisVoice): Promise<void>;
}

export class SpeechSynthesizer implements ISpeechSynthesizer {
  constructor(
    private ss: SpeechSynthesis = speechSynthesis
  ) { }

  public async Speak(phrase: string | SpeechSynthesisUtterance, voice?: SpeechSynthesisVoice): Promise<void> {
    return new Promise((resolve) => {
      const utterance = typeof phrase === 'string' ?
        new SpeechSynthesisUtterance(phrase) : phrase;
      utterance.voice = utterance.voice || voice || this.ss.getVoices()[0];
      utterance.onend = () => resolve();
      this.ss.speak(utterance);
    });
  }
}
