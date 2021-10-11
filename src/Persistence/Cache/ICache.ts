export interface ICache<T> {
  Add(key: string, value: T): void;
  Get(type: { new(): T; }, key: string): T | null;
  Delete(key: string): void;
}
