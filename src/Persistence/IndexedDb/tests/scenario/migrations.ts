import { StoreNames } from './types';

export const migrations = [
  {
    version: 1,
    command: (db: IDBDatabase) => {
      db.createObjectStore(StoreNames.Customers, { keyPath: 'id' });
    }
  },
  {
    version: 2,
    command: (db: IDBDatabase) => {
      db.createObjectStore(StoreNames.Transactions, { keyPath: 'id' });
    }
  }
];
