import { Strings } from '../../System/Strings';
import { Result } from '../../Patterns/Result/Result';
import { Command, Query } from '../../Patterns/CommandQuery/module';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Cookies } from '../../Utility/Web/Cookies';
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
  private static sanitizeValue(value?: string | boolean): string | boolean {
    if (typeof value === 'boolean') {
      return value;
    } else if (typeof value === 'string') {
      return value.split(';')[0];
    }
    return Strings.Empty;
  }

  constructor(
    private serializer = new JsonSerializer(),
    private mainDocument = document
  ) { }

  public Get<T>(type: new () => T, key: string): Result<T> {
    return new Query(() => {
      const value = this.GetValue(key).Value;
      if (value) {
        return this.serializer.Deserialize(type, JSON.parse(value)) as T;
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
      const cookieMap = Cookies.GetCookieMap(this.mainDocument);
      const value = cookieMap.get(key);

      if (value) {
        return value;
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
        ? `${k}=${CookieStorage.sanitizeValue(options[k])};` : Strings.Empty).join('');
      const newCookie = `${key}=${CookieStorage.sanitizeValue(value)};${optionsString}`;

      this.mainDocument.cookie = newCookie;
    }).Execute();
  }

  public Remove(key: string, path = '/', domain?: string): Result<null> {
    return new Command(() => {
      this.SetValue(key, Strings.Empty, {
        expires: new Date(0),
        domain,
        path
      });
    }).Execute();
  }
}
