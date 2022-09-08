import { Strings } from '../../System/Strings';
import { Result } from '../../Patterns/Result/Result';
import { Command, Query } from '../../Patterns/CommandQuery/module';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from './IGenericStorage';

enum CookieOptionKeys {
  Domain = 'domain',
  Path = 'path',
  Expires = 'expires',
  Secure = 'secure',
  SameSite = 'samesite',
  Priority = 'priority'
}

type CookieOptions = {
  [CookieOptionKeys.Domain]?: string,
  [CookieOptionKeys.Path]?: string,
  [CookieOptionKeys.Expires]?: Date,
  [CookieOptionKeys.Secure]?: boolean,
  [CookieOptionKeys.SameSite]?: 'lax' | 'strict',
  [CookieOptionKeys.Priority]?: 'low' | 'medium' | 'high'
}

/**
 * Provides a generic interface for interacting with Cookies
 */
export class CookieStorage implements IGenericStorage {
  constructor(
    private serializer = new JsonSerializer(),
    private mainDocument = document
  ) { }

  public Get<T>(type: new () => T, key: string): Result<T> {
    return new Query(() => {
      const value = this.GetValue(key).Value;
      if (value) {
        return this.serializer.Serialize(type, JSON.parse(value)) as T;
      } else {
        throw new Error(`Unable to retrieve "${key}"`);
      }
    }).Execute();
  }

  public Set<T>(key: string, value: T, options?: CookieOptions): Result<null> {
    return new Command(() => {
      this.SetValue(key, JSON.stringify(value), options);
    }).Execute();
  }

  public GetValue(key: string): Result<string> {
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

  public SetValue(key: string, value: string, options: CookieOptions = {
    path: '/',
    secure: true,
    samesite: 'strict'
  }): Result<null> {
    return new Command(() => {
      const optionKeys = Object.values(CookieOptionKeys) as CookieOptionKeys[];
      const expiresOptionString = options.expires ?
        `expires=${options.expires.toUTCString()};` : Strings.Empty;
      const optionsString = expiresOptionString + optionKeys.map(k => k !== CookieOptionKeys.Expires && !!options[k]
        ? `${k}=${options[k]};` : Strings.Empty).join('');
      const newCookie = `${key}=${value};${optionsString}`;

      this.mainDocument.cookie = newCookie;
    }).Execute();
  }

  public Remove(key: string, path = '/'): Result<null> {
    return new Command(() => {
      this.mainDocument.cookie = `${key}=;expires=${new Date(0).toUTCString()};path=${path}`;
    }).Execute();
  }
}
