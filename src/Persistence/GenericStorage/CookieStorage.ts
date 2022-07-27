import { Command, GenericResult, Result } from '../../Patterns/module';
import { Strings } from '../../public_api';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from './IGenericStorage';

/**
 * Provides a generic interface for interacting with Cookies
 */
export class CookieStorage implements IGenericStorage {
  constructor(
    private serializer = new JsonSerializer(),
    private getCookie = () => document.cookie
  ) { }

  public Get<T>(type: new () => T, key: string): GenericResult<T> {
    throw new Error('Method not implemented.');
  }

  public Set<T>(key: string, value: T): Result {
    throw new Error('Method not implemented.');
  }

  public GetValue(key: string): GenericResult<any> {
    throw new Error('Method not implemented.');
  }

  public SetValue(key: string, value: string, expirationDate?: Date): Result {
    return new Command(() => {
      const newCookie = `${key}=${value};${expirationDate ?
        `expires=${expirationDate.toUTCString()}` : Strings.Empty};path=/`;
      document.cookie = newCookie;
    }).Execute();
  }

  public Remove(key: string): Result {
    return new Command(() => {
      document.cookie = `${key}=;expires=${new Date(0).toUTCString()};path=/`;
    }).Execute();
  }
}
