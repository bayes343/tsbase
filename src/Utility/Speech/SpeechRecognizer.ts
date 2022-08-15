import { Strings } from '../../System/Strings';
import { ISpeechRecognition, SpeechRecognitionEvents } from './ISpeechRecognition';

declare global {
  interface Window {
    webkitSpeechRecognition?: { new(): ISpeechRecognition }
  }
}

export interface ISpeechRecognizer {
  Listen(): Promise<string>;
}

export class SpeechRecognizer implements ISpeechRecognizer {
  private sr: ISpeechRecognition;

  constructor(
    private speechRecognition = window.webkitSpeechRecognition as unknown as { new(): ISpeechRecognition }
  ) {
    if (!this.speechRecognition) {
      throw new Error('No speech recognition service is available.');
    }

    this.sr = new this.speechRecognition();
    this.sr.continuous = false;
    this.sr.interimResults = false;
  }

  public async Listen(): Promise<string> {
    return new Promise((resolve) => {
      let result = Strings.Empty;

      this.sr.addEventListener(SpeechRecognitionEvents.Result, (e) => {
        if (e.results) {
          result = Array.from(e.results)[0].transcript;
        }
      });

      this.sr.addEventListener(SpeechRecognitionEvents.End, () => {
        resolve(result);
      });
    });
  }
}
