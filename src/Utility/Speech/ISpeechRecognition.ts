// don't include in module

/**
 * Available speech recognition events in the webkit speech recognition api
 */
export enum SpeechRecognitionEvents {
  Audioend = 'audioend',
  Audiostart = 'audiostart',
  End = 'end',
  Error = 'error',
  Nomatch = 'nomatch',
  Result = 'result',
  Soundend = 'soundend',
  Soundstart = 'soundstart',
  Speechend = 'speechend',
  Speechstart = 'speechstart',
  Start = 'start'
}

export type SpeechRecognitionEvent = {
  results: Iterable<{ transcript: string }[]>
};

/**
 * Abstraction of relevant members in the webkit speech recognition api
 */
export interface ISpeechRecognition {
  continuous: boolean,
  interimResults: boolean,
  lang: string,
  maxAlternatives: number,
  addEventListener(
    eventName: SpeechRecognitionEvents,
    callback: (event: SpeechRecognitionEvent) => void | null
  ): void;
  removeEventListener(
    eventName: SpeechRecognitionEvents,
    callback: (event: SpeechRecognitionEvent) => void | null
  ): void;
  start: () => void,
  stop: () => void
}
