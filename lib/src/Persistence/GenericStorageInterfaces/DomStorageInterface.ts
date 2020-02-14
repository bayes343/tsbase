import { IGenericStorageInterface } from './IGenericStorageInterface';
import { GenericResult, Result } from '../../public_api';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Command } from '../../Patterns/Command/Command';

export enum DomStorageMode {
  Session,
  Local
};

export class DomStorageInterface implements IGenericStorageInterface {
  constructor(
    private storageMode: DomStorageMode,
    private serializer = new JsonSerializer()
  ) { }

  public Get<T>(type: { new(): T; }, key: string): GenericResult<T> {
    const command = () =>
      this.serializer.Serialize(type, this.getStorageMedium().getItem(key)) as T;

    return new Command(command).Execute();
  }

  public Set<T>(key: string, value: T): Result {
    const command = () =>
      this.getStorageMedium().setItem(key, JSON.stringify(value));

    return new Command(command).Execute();
  }

  public Remove(key: string): Result {
    const command = () =>
      this.getStorageMedium().removeItem(key);

    return new Command(command).Execute();
  }

  private getStorageMedium(): Storage {
    if (this.storageMode === DomStorageMode.Local) {
      return window.localStorage;
    } else {
      return window.sessionStorage;
    }
  }
}
