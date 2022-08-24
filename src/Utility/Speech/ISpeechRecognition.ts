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
    callback: (event: {
      results: Iterable<{ transcript: string }[]>
    }) => void | null
  ): void;
  start: () => void,
  stop: () => void
}
