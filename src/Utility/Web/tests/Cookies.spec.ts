import { Cookies } from '../Cookies';

describe('Cookies', () => {
  it('should return a map of cookie key/value pairs from document', () => {
    const map = Cookies.GetCookieMap({ cookie: 'one=1; two=2; three=3;4=four; ' } as Document);

    expect(map.get('one')).toEqual('1');
    expect(map.get('two')).toEqual('2');
    expect(map.get('three')).toEqual('3');
    expect(map.get('4')).toEqual('four');
  });

  it('should return a map of cookie key/value pairs from string', () => {
    const map = Cookies.GetCookieMap('one=1; two=2; three=3;4=four; ');

    expect(map.get('one')).toEqual('1');
    expect(map.get('two')).toEqual('2');
    expect(map.get('three')).toEqual('3');
    expect(map.get('4')).toEqual('four');
  });

  it('should return null when cookie not set', () => {
    expect(Cookies.GetCookieValue('test' as any, '')).toEqual(null);
  });

  it('should return null for empty cookies value', () => {
    expect(Cookies.GetCookieValue('test' as any, 'test=')).toEqual(null);
  });

  it('GetCookieMap should handle cookie values containing equals signs', () => {
    const cookieString = 'name=value=with=equals; other=normal';
    const map = Cookies.GetCookieMap(cookieString);

    expect(map.get('name')).toBe('value=with=equals');
    expect(map.get('other')).toBe('normal');
  });

  it('GetCookieMap should URL-decode cookie values', () => {
    const encodedCookieString = 'token=abc%20def; email=user%40example.com; data=a%3Db';
    const map = Cookies.GetCookieMap(encodedCookieString);

    expect(map.get('token')).toBe('abc def');
    expect(map.get('email')).toBe('user@example.com');
  });

  it('GetCookieValue should handle cookie values containing equals signs', () => {
    const cookieString = 'name=value=with=equals; other=normal';

    expect(Cookies.GetCookieValue('name', cookieString)).toBe('value=with=equals');
    expect(Cookies.GetCookieValue('other', cookieString)).toBe('normal');
  });
});
