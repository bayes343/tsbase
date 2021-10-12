import { Command } from '../../../Patterns/CommandQuery/Command';
import { IPersister } from './IPersister';

type StorageType = 'local' | 'session';
const DomStorageUndefined = 'DomStorageUndefined - Unable to use DomStoragePersister since, \"Storage\" is not defined';

/**
 * Persists data using the html DomStorage apis (local and session)
 */
export class DomStoragePersister<T> implements IPersister<T> {
  constructor(
    private key: string,
    private storageType: StorageType
  ) {
    new Command(() => {
      if (typeof (Storage) === 'undefined') {
        throw new Error(DomStorageUndefined);
      }
    }).Execute();
  }

  public Purge(): void {
    if (this.storageType === 'session') {
      window.sessionStorage.removeItem(this.key);
    } else {
      window.localStorage.removeItem(this.key);
    }
  }

  public Retrieve(): Array<any> {
    let storedData = this.getItemFromDomStorage(this.key);
    storedData = JSON.parse(storedData);
    return storedData ? storedData : [];
  }

  public Persist(items: Array<any>): void {
    const stringifiedItems = JSON.stringify(items);
    this.Purge();
    this.saveItemToDomStorage(this.key, stringifiedItems);
  }

  private saveItemToDomStorage(key: string, item: string): void {
    if (this.storageType === 'session') {
      window.sessionStorage.setItem(key, item);
    } else {
      window.localStorage.setItem(key, item);
    }
  }

  private getItemFromDomStorage(key: string): any {
    let item: any;
    if (this.storageType === 'session') {
      item = window.sessionStorage.getItem(key);
    } else {
      item = window.localStorage.getItem(key);
    }
    return item;
  }
}
