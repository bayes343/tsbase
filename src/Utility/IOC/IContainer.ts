/**
 * A light weight inversion of control (IOC) container
 */
export interface IContainer<T> {
  /**
   * Set the dependencies to be managed by the Container
   * Call this method outside the module which constructs the Container instance in order to preserve inversion.
   * @param t Concrete dependencies conforming to abstractions in T
   */
  Init(t: T): void;
  /**
   * Retrieve the desired dependency through type safe lambda syntax
   * @param dependency Selection function for the desired dependency
   */
  Get<D>(dependency: (t: T) => D): D;
}
