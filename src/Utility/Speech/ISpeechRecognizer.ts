import { ISpeechCommand } from './ISpeechCommand';

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
