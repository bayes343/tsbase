/**
 * String helper class
 */
export class Strings {
  private constructor() { }

  /**
   * Returns an empty string: ''
   */
  public static get Empty(): string {
    return '';
  }

  /**
   * Returns a single space: ' '
   */
  public static get Space(): string {
    return ' ';
  }

  /**
   * Returns the camel cased version of the given string
   * NOTE: For multi word strings that are not separated by spaces, this function will merely lowercase the first character
   * @param string
   */
  public static CamelCase(string: string): string {
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * Returns the pascal cased version of the given string
   * NOTE: For multi word strings that are not separated by spaces, this function will merely uppercase the first character
   * @param string
   */
  public static PascalCase(string: string): string {
    return string
      .split(Strings.Space)
      .map(s => `${s[0].toUpperCase()}${s.slice(1)}`)
      .join('');
  }

  /**
   * Returns true if the given string is null, empty, or consists purely of whitespace
   * @param string
   */
  public static IsEmptyOrWhiteSpace(string: string | null | undefined): boolean {
    return !string || string.trim().length === 0;
  }
}
