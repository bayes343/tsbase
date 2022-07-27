import { Strings } from '../../System/Strings';
import { GenericResult, Result } from '../../Patterns/Result/module';
import { Command, Query } from '../../Patterns/CommandQuery/module';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from './IGenericStorage';

enum CookieOptionKeys {
  Domain = 'domain',
  Path = 'path',
  Expires = 'expires',
  Secure = 'secure',
  SameSite = 'samesite',
  PartitionKey = 'partitionkey',
  Priority = 'priority'
}

type CookieOptions = {
  [CookieOptionKeys.Domain]?: string,
  [CookieOptionKeys.Path]?: string,
  [CookieOptionKeys.Expires]?: Date,
  [CookieOptionKeys.Secure]?: boolean,
  [CookieOptionKeys.SameSite]?: boolean,
  [CookieOptionKeys.PartitionKey]?: string,
  [CookieOptionKeys.Priority]?: number
}

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

  public Set<T>(key: string, value: T, options?: CookieOptions): Result {
    return new Command(() => {
      this.SetValue(key, JSON.stringify(value), options);
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

  public SetValue(key: string, value: string, options?: CookieOptions): Result {
    return new Command(() => {
      const optionKeys = Object.keys(CookieOptionKeys) as CookieOptionKeys[];
      const expiresOptionString = options?.expires ?
        `expires=${options?.expires.toUTCString()};` : Strings.Empty;
      const optionsString = expiresOptionString + (options ? optionKeys.map(k => k !== CookieOptionKeys.Expires && options[k]
        ? `${k}=${options[k]}` : Strings.Empty).join(';') : Strings.Empty);

      const newCookie = `${key}=${value};${optionsString};`;
      this.mainDocument.cookie = newCookie;
    }).Execute();
  }

  public Remove(key: string): Result {
    return new Command(() => {
      this.mainDocument.cookie = `${key}=;expires=${new Date(0).toUTCString()};path=/`;
    }).Execute();
  }
}
