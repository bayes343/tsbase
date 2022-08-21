export interface ISpeechCommand {
  Condition: (transcript: string) => boolean,
  Action: () => boolean
}
