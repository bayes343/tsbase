import { Cookies } from '../Cookies';

describe('Cookies', () => {
  it('should return a map of cookie key/value pairs', () => {
    const map = Cookies.GetCookieMap({ cookie: 'one=1; two=2; three=3;4=four; ' } as Document);

    expect(map.get('one')).toEqual('1');
    expect(map.get('two')).toEqual('2');
    expect(map.get('three')).toEqual('3');
    expect(map.get('4')).toEqual('four');
  });
});
