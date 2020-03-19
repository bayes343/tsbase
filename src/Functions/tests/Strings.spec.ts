import { Strings } from '../Strings';

describe('Strings', () => {
  it('should return an empty string', () => {
    expect(Strings.Empty).toEqual('');
  });

  it('should return a space', () => {
    expect(Strings.Space).toEqual(' ');
  });

  it('should camel case a given string', () => {
    expect(Strings.CamelCase('SomeString')).toEqual('someString');
  });

  it('should pascal case a given string', () => {
    expect(Strings.PascalCase('someString')).toEqual('SomeString');
  });

  it('should detect an empty string', () => {
    expect(Strings.IsEmptyOrWhiteSpace('')).toBeTruthy();
  });

  it('should detect a whitespace string', () => {
    expect(Strings.IsEmptyOrWhiteSpace(' ')).toBeTruthy();
  });

  it('should detect a non-whitespace string with length', () => {
    expect(Strings.IsEmptyOrWhiteSpace('test')).toBeFalsy();
  });
});
