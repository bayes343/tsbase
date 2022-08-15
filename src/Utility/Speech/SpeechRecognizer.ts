import { Strings } from '../../System/Strings';
import { ISpeechRecognition, SpeechRecognitionEvents } from './ISpeechRecognition';

declare global {
  interface Window {
    webkitSpeechRecognition?: { new(): ISpeechRecognition }
  }
}

interface ISpeechCommand {
  Condition: (transcript: string) => boolean,
  Action: () => boolean
}

/**
 * Provides an interface for listening to and interacting with user speech
 */
export interface ISpeechRecognizer {
  /**
   * Asynchronously listen for user speech
   */
  Listen(): Promise<string>;
  /**
   * Continuously listen and react with the given commands to user speech until a given condition is met
   * @param commands
   * @param until
   */
  HandleSpeechCommands(commands: ISpeechCommand[], until: () => boolean): Promise<void>;
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
