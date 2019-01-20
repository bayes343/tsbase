import { IPersistable } from './IPersistable';
import { List } from '../Collections/List';

type StorageType = 'local' | 'session';

export class DomStoragePersister implements IPersistable {
  constructor(
    private key: string,
    private storageType: StorageType
  ) {
    if (typeof (Storage) === 'undefined') {
      throw new Error('Unable to use DomStoragePersister since, \"Storage\" is not defined');
    }
  }

  Purge(): void {
    if (this.storageType == 'session') {
      window.sessionStorage.removeItem(this.key);
    } else {
      window.localStorage.removeItem(this.key);
    }
  }

  Retrieve(): List<any> {
    let result = new List<any>();
    let storedData = this.getItemFromDomStorage(this.key);
    storedData = JSON.parse(storedData);
    if (storedData) {
      result = Object.assign(new List<any>(), {
        Item: storedData['Item'],
        Count: storedData['Count']
      });
    }
    return result;
  }

  Persist(items: List<any>): void {
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