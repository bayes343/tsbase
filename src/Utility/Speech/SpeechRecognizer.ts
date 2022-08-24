import { Strings } from '../../System/Strings';
import { ISpeechCommand } from './ISpeechCommand';
import { ISpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionEvents } from './ISpeechRecognition';
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

      const resultEvent = (e: SpeechRecognitionEvent) => { result = Array.from(e.results)[0][0].transcript; };
      const endEvent = () => {
        this.speechRecognition.removeEventListener(SpeechRecognitionEvents.Result, resultEvent);
        this.speechRecognition.removeEventListener(SpeechRecognitionEvents.End, endEvent);
        resolve(result);
      };

      this.speechRecognition.addEventListener(SpeechRecognitionEvents.Result, resultEvent);
      this.speechRecognition.addEventListener(SpeechRecognitionEvents.End, endEvent);
      this.speechRecognition.start();
    });
  }

  public async HandleSpeechCommands(commands: ISpeechCommand[], until: () => boolean): Promise<void> {
    return new Promise((resolve) => {
      const resultEvent = (e: SpeechRecognitionEvent) => {
        const transcript = Array.from(e.results)[0][0].transcript;
        const command = commands.find(c => c.Condition(transcript));
        command ? command.Action() : null;
      };
      const endEvent = () => {
        if (until()) {
          this.speechRecognition.stop();
          this.speechRecognition.removeEventListener(SpeechRecognitionEvents.Result, resultEvent);
          this.speechRecognition.removeEventListener(SpeechRecognitionEvents.End, endEvent);
          resolve();
        } else {
          this.speechRecognition.start();
        }
      };

      this.speechRecognition.addEventListener(SpeechRecognitionEvents.Result, resultEvent);
      this.speechRecognition.addEventListener(SpeechRecognitionEvents.End, endEvent);
      this.speechRecognition.start();
    });
  }
}
