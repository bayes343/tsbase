export interface IPersistable {
  Retrieve(): Array<any>;
  Persist(items: Array<any>): void;
  Purge(): void;
}