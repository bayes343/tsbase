import { IPersister } from './IPersister';
import { Errors } from '../../Errors';
import { Command } from '../../Patterns/CommandQuery/Command';

type StorageType = 'local' | 'session';

/**
 * Persists data using the html WebStorage apis (local and session)
 */
export class WebStoragePersister implements IPersister {
  constructor(
    private key: string,
    private storageType: StorageType
  ) {
    new Command(() => {
      if (typeof (Storage) === 'undefined') {
        throw new Error(Errors.WebStorageUndefined);
      }
    }).Execute();
  }

  /**
   * Delete all data previously stored in WebStorage
   */
  Purge(): void {
    if (this.storageType === 'session') {
      window.sessionStorage.removeItem(this.key);
    } else {
      window.localStorage.removeItem(this.key);
    }
  }

  /**
   * Retrieve the collection of data previously stored in WebStorage
   */
  Retrieve(): Array<any> {
    let storedData = this.getItemFromDomStorage(this.key);
    storedData = JSON.parse(storedData);
    return storedData ? storedData : [];
  }

  /**
   * Persist the given collection in WebStorage
   * @param items
   */
  Persist(items: Array<any>): void {
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
