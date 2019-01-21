import { List } from '../Collections/List';

export interface IPersistable {
  Retrieve(): Array<any>;
  Persist(items: Array<any>): void;
  Purge(): void;
}