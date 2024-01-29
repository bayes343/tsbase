/**
 * Contract for tsbase classes that deserialize data into class instances
 */
export interface ISerializer {
  /**
   * Deserializes data into an instance of t
   * @param t
   * @param data
   */
  Deserialize<T>(t: { new(): T; }, data: any): T;
}
