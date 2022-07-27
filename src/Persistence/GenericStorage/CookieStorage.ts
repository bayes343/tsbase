import { Strings } from '../../System/Strings';
import { GenericResult, Result } from '../../Patterns/Result/module';
import { Command, Query } from '../../Patterns/CommandQuery/module';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from './IGenericStorage';

/**
 * Provides a generic interface for interacting with Cookies
 */
export class CookieStorage implements IGenericStorage {
  constructor(
    private serializer = new JsonSerializer(),
    private mainDocument = document
  ) { }

  public Get<T>(type: new () => T, key: string): GenericResult<T> {
    return new Query(() => {
      const value = this.GetValue(key).Value;
      if (value) {
        return this.serializer.Serialize(type, JSON.parse(value)) as T;
      } else {
        throw new Error(`Unable to retrieve "${key}"`);
      }
    }).Execute();
  }

  public Set<T>(key: string, value: T, expirationDate?: Date): Result {
    return new Command(() => {
      this.SetValue(key, JSON.stringify(value), expirationDate);
    }).Execute();
  }

  public GetValue(key: string): GenericResult<string> {
    return new Query(() => {
      const cookiePairs = this.mainDocument.cookie.split(';');
      const cookieKeys = cookiePairs.map(c => c.split('=')[0]);
      const cookieValues = cookiePairs.map(c => c.split('=')[1]);
      const keyIndex = cookieKeys.indexOf(key);

      if (keyIndex >= 0) {
        return cookieValues[keyIndex];
      } else {
        throw new Error(`Unable to retrieve "${key}"`);
      }
    }).Execute();
  }

  public SetValue(key: string, value: string, expirationDate?: Date): Result {
    return new Command(() => {
      const newCookie = `${key}=${value};${expirationDate ?
        `expires=${expirationDate.toUTCString()}` : Strings.Empty};path=/`;
      this.mainDocument.cookie = newCookie;
    }).Execute();
  }

  public Remove(key: string): Result {
    return new Command(() => {
      this.mainDocument.cookie = `${key}=;expires=${new Date(0).toUTCString()};path=/`;
    }).Execute();
  }
}
