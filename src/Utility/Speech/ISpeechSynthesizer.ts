/**
 * Provides an interface for synthesizing speech
 */
export interface ISpeechSynthesizer {
  /**
   * Asynchronously synthesize the given phrase or utterance in the configured or specified voice
   * @param phrase
   * @param voice
   */
  Speak(
    phrase: string | SpeechSynthesisUtterance,
    voice?: SpeechSynthesisVoice,
    utteranceFactory?: (phrase: string) => SpeechSynthesisUtterance
  ): Promise<void>;
}
