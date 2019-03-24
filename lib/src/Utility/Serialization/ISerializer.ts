/**
 * Contract for tsbase objects that serialize data into class instances
 */
export interface ISerializer<T> {
  /**
   * Serializes data into an instance of t
   * @param t 
   * @param data 
   */
  Serialize(t: { new(): T; }, data: any): T;
}