import { DoUntil } from '../../Functions/DoUntil';
import { AsyncCommand, AsyncQuery } from '../../Patterns/CommandQuery/module';
import { GenericResult, Result } from '../../Patterns/Result/module';
import { IIndexedDb } from './IIndexedDb';
import { Migration } from './Migration';
import { TransactionMode } from './TransactionModes';

export class IndexedDb implements IIndexedDb {
  public static Instance(name: string, version: number, migrations: Migration[]): IIndexedDb {
    return new IndexedDb(name, version, migrations);
  }

  private database: IDBDatabase | null = null;
  public get Connected(): boolean {
    return !!this.database;
  };

  private constructor(
    public Name: string,
    public Version: number,
    private migrations: Migration[]
  ) { }

  public async Connect(): Promise<GenericResult<IDBDatabase | null>> {
    return new AsyncQuery<IDBDatabase | null>(async () => {
      if (this.Connected) {
        return this.database;
      } else {
        const openRequest = indexedDB.open(this.Name, this.Version);
        this.setOpenRequestHandlers(openRequest, this.migrations);

        await DoUntil(() => this.Connected);
        return this.database;
      }
    }).Execute();
  }

  public Insert(insertions: Record<string, object[]>): Promise<Result> {
    const storeNames = Object.keys(insertions);

    return this.executeTransaction(storeNames, (transaction) => {
      storeNames.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const objects = insertions[storeName];
        objects.forEach(object => {
          store.add(object);
        });
      });
    });
  }

  public Get<T>(storeName: string, query: string | number | ((t: T) => boolean)): Promise<GenericResult<T | T[] | null>> {
    return new AsyncQuery(async () => {
      await this.Connect();
      let complete = false;
      let result: T | T[] | null = null;

      const transaction = (this.database as IDBDatabase).transaction([storeName], TransactionMode.ReadOnly);
      const store = transaction.objectStore(storeName);

      if (typeof query === 'string' || typeof query === 'number') {
        const request = store.get(query);
        request.onsuccess = () => {
          result = request.result || null;
          complete = true;
        };
      } else {
        store.openCursor().onsuccess = (event) => {
          result = result ? result as T[] : new Array<T>();
          const cursor = (event.target as any).result;

          if (cursor && query(cursor['value'])) {
            result.push(cursor.value);
            cursor.continue();
          } else if (cursor) {
            cursor.continue();
          } else {
            complete = true;
          }
        };
      }

      await DoUntil(() => complete);
      return result;
    }).Execute();
  }

  public GetAll<T>(storeName: string): Promise<GenericResult<T[]>> {
    return new AsyncQuery(async () => {
      await this.Connect();
      let complete = false;
      let result = new Array<T>();

      const request = (this.database as IDBDatabase).transaction([storeName], TransactionMode.ReadOnly)
        .objectStore(storeName)
        .getAll();

      request.onsuccess = (event) => {
        result = (event as any).target.result as T[];
        complete = true;
      };

      await DoUntil(() => complete);
      return result;
    }).Execute();
  }

  public Delete(deletions: Record<string, string[]>): Promise<Result> {
    const storeNames = Object.keys(deletions);

    return this.executeTransaction(storeNames, (transaction) => {
      storeNames.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const keys = deletions[storeName];

        keys.forEach(key => {
          store.delete(key);
        });
      });
    });
  }

  public Update(updates: Record<string, object[]>): Promise<Result> {
    const storeNames = Object.keys(updates);

    return this.executeTransaction(storeNames, (transaction) => {
      storeNames.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const objects = updates[storeName];

        objects.forEach(object => {
          store.put(object);
        });
      });
    });
  }

  public Disconnect(): void {
    this.database?.close();
    this.database = null;
  }

  private setOpenRequestHandlers(openRequest: IDBOpenDBRequest, migrations: Migration[]): void {
    openRequest.onupgradeneeded = async (e) => {
      const db = openRequest.result;

      for (const migration of migrations) {
        if (
          e.oldVersion < migration.version,
          this.Version >= migration.version
        ) {
          migration.command(db);
        }
      }
    };
    openRequest.onsuccess = () => this.database = openRequest.result;
  }

  private executeTransaction(storeNames: string[], command: (transaction: IDBTransaction) => void): Promise<Result> {
    return new AsyncCommand(async () => {
      await this.Connect();
      let complete = false;
      const transaction = (this.database as IDBDatabase).transaction(storeNames, TransactionMode.ReadWrite);

      command(transaction);
      transaction.oncomplete = () => complete = true;

      await DoUntil(() => complete);
    }).Execute();
  }
}
