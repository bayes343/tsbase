import { Result } from '../Result/Result';

export interface ICommand {
  Command: () => void;
  Execute(): Result;
}
