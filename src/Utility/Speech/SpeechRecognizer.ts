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
  private speechRecognition: ISpeechRecognition;

  constructor(
    speechRecognition: ISpeechRecognition | null = window && window.webkitSpeechRecognition ?
      new window.webkitSpeechRecognition() : null
  ) {
    if (!speechRecognition) {
      throw new Error('No speech recognition service is available.');
    } else {
      this.speechRecognition = speechRecognition;
    }

    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;
  }

  public async Listen(): Promise<string> {
    return new Promise((resolve) => {
      let result = Strings.Empty;

      this.speechRecognition.addEventListener(SpeechRecognitionEvents.Result, (e) => {
        result = Array.from(e.results)[0][0].transcript;
      });

      this.speechRecognition.addEventListener(SpeechRecognitionEvents.End, () => {
        resolve(result);
      });

      this.speechRecognition.start();
    });
  }

  public async HandleSpeechCommands(commands: ISpeechCommand[], until: () => boolean): Promise<void> {
    return new Promise((resolve) => {
      this.speechRecognition.addEventListener(SpeechRecognitionEvents.Result, (e) => {
        const transcript = Array.from(e.results)[0][0].transcript;
        const command = commands.find(c => c.Condition(transcript));
        command ? command.Action() : null;
      });

      this.speechRecognition.addEventListener(SpeechRecognitionEvents.End, () => {
        if (until()) {
          this.speechRecognition.stop();
          resolve();
        } else {
          this.speechRecognition.start();
        }
      });

      this.speechRecognition.start();
    });
  }
}
