import { Result } from '../Result/Result';

export interface ICommand {
  Command: () => any;
  Execute(): Result;
}
