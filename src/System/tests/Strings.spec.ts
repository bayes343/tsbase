import { Strings } from '../Strings';

describe('Strings', () => {
  it('should return an empty string', () => {
    expect(Strings.Empty).toEqual('');
  });

  it('should return a space', () => {
    expect(Strings.Space).toEqual(' ');
  });

  it('should camel case a given string', () => {
    expect(Strings.CamelCase('Some string')).toEqual('someString');
    expect(Strings.CamelCase('SomeString')).toEqual('someString');
  });

  it('should pascal case a given string', () => {
    expect(Strings.PascalCase('some string')).toEqual('SomeString');
    expect(Strings.PascalCase('someString')).toEqual('SomeString');
  });

  it('should detect a null string (value)', () => {
    const nullString: string | null = null;
    expect(Strings.IsEmptyOrWhiteSpace(nullString)).toBeTruthy();
  });

  it('should detect an undefined string (value)', () => {
    const undefinedString: string | undefined = undefined;
    expect(Strings.IsEmptyOrWhiteSpace(undefinedString)).toBeTruthy();
  });

  it('should detect an empty string', () => {
    expect(Strings.IsEmptyOrWhiteSpace(Strings.Empty)).toBeTruthy();
  });

  it('should detect a whitespace string', () => {
    expect(Strings.IsEmptyOrWhiteSpace(Strings.Space)).toBeTruthy();
  });

  it('should detect a non-whitespace string with length', () => {
    expect(Strings.IsEmptyOrWhiteSpace('test')).toBeFalsy();
  });

  it('should return an empty string when pascal casing an empty string', () => {
    expect(Strings.PascalCase(Strings.Empty)).toEqual(Strings.Empty);
  });

  it('should return an empty string when camel casing an empty string', () => {
    expect(Strings.CamelCase(Strings.Empty)).toEqual(Strings.Empty);
  });
});
