import { Strings } from '../../System/Strings';
import { ISpeechCommand } from './ISpeechCommand';
import { ISpeechRecognition, SpeechRecognitionEvents } from './ISpeechRecognition';
import { ISpeechRecognizer } from './ISpeechRecognizer';

declare global {
  interface Window {
    webkitSpeechRecognition?: { new(): ISpeechRecognition }
  }
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
        result = Array.from(e.results)[0].transcript;
      });

      this.sr.addEventListener(SpeechRecognitionEvents.End, () => {
        resolve(result);
      });

      this.sr.start();
    });
  }

  public async HandleSpeechCommands(commands: ISpeechCommand[], until: () => boolean): Promise<void> {
    return new Promise((resolve) => {
      this.sr.addEventListener(SpeechRecognitionEvents.Result, (e) => {
        const transcript = Array.from(e.results)[0].transcript;
        const command = commands.find(c => c.Condition(transcript));
        command ? command.Action() : null;
      });

      this.sr.addEventListener(SpeechRecognitionEvents.End, () => {
        if (until()) {
          this.sr.stop();
          resolve();
        } else {
          this.sr.start();
        }
      });

      this.sr.start();
    });
  }
}
