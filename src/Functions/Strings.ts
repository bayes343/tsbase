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
   * @param string
   */
  public static CamelCase(string: string): string {
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * Returns the pascal cased version of the given string
   * @param string
   */
  public static PascalCase(string: string): string {
    return string.replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), s => s.toUpperCase());
  }

  /**
   * Returns true if the given string is null, empty, or consists purely of whitespace
   * @param string
   */
  public static IsEmptyOrWhiteSpace(string: string | null | undefined): boolean {
    return !string || string.trim().length === 0;
  }
}
