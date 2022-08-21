/**
 * Provides an interface for "if Condition then Action" speech commands
 *
 * Condition: the predicate to taking the "Action" evaluated against the given transcript
 * Action: the action to be taken once the transcript satisfies the predicate "Condition"
 */
export interface ISpeechCommand {
  Condition: (transcript: string) => boolean,
  Action: () => boolean
}
