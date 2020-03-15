import { IPipe } from './IPipe';

export class Pipeline<T> implements IPipe<T> {
  constructor(private pipes: Array<IPipe<T>>) { }

  /**
   * Transforms a given object based on the pipes used to construct the pipeline
   * @param object
   */
  Transform(object: T): T {
    this.pipes.forEach(pipe => {
      object = pipe.Transform(object);
    });

    return object;
  }
}
