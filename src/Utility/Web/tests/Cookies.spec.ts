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
});
