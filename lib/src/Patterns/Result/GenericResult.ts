import { Result } from './Result';

/**
 * Extension of the Result class that allows a generic value to be returned with the result -
 * Ex: return the current state of an item after a save operation succeeded or failed.
 */
export class GenericResult<T> extends Result {
  constructor(public Value: T) {
    super();
  }
}
