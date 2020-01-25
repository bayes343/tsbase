export type Action = () => void;
export type Condition = () => boolean;

export interface IConditionalTimer {
  DoWhen(action: Action, condition: Condition): void;
  DoUntil(action: Action, condition: Condition): void;
  DoWhile(action: Action, condition: Condition): void;
  Stop(): void;
}
