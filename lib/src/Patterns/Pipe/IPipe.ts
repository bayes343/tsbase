export interface IPipe<T> {
  /**
   * Transforms a given object, returning one of the same type
   * @param object
   */
  Transform(object: T): T;
}
