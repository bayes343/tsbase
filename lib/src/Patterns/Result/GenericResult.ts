import { Result } from './Result';

export class GenericResult<T> extends Result {
  constructor(public Value: T) {
    super();
  }
}
