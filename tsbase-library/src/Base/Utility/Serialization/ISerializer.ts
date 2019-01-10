export interface ISerializer<T> {
  Serialize(t: { new(): T; }, json: any): T;
}