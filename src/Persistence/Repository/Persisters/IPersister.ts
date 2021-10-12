export interface IPersister<T> {
  Retrieve(): Array<T>;
  Persist(items: Array<T>): void;
  Purge(): void;
}
