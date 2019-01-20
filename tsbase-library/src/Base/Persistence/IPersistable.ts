import { List } from '../Collections/List';

export interface IPersistable {
  Retrieve(): List<any>;
  Persist(items: List<any>): void;
  Purge(): void;
}