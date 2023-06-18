import { Regex } from './Regex';

export class Strings {
  private constructor() { }

  public static readonly Empty = '';
  public static readonly Space = ' ';

  /**
   * Returns the camel cased version of the given string
   * NOTE: For multi word strings that are not separated by spaces, this function will merely lowercase the first character
   * @param string
   */
  public static CamelCase(string: string): string {
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, Strings.Empty);
  }

  /**
   * Returns the pascal cased version of the given string
   * NOTE: For multi word strings that are not separated by spaces, this function will merely uppercase the first character
   * @param string
   */
  public static PascalCase(string: string): string {
    return string
      .split(Strings.Space)
      .map(s => `${s[0]?.toUpperCase() || this.Empty}${s.slice(1)}`)
      .join(Strings.Empty);
  }

  /**
   * Returns true if the given string is null, empty, or consists purely of whitespace
   * @param string
   */
  public static IsEmptyOrWhiteSpace(string: string | null | undefined): boolean {
    return !string || string.trim().length === 0;
  }

  /**
   * Returns a version of the given string minus new line characters and whitespace characters between tags
   * @param string
   */
  public static MinifyXml(string: string): string {
    const newLines = /\r?\n|\r/g;
    const spacesBetweenXmlTags = /\r?>(\s+)<|\r/g;

    return string.replace(newLines, Strings.Empty)
      .replace(spacesBetweenXmlTags, '><');
  }

  /**
   * Returns a "slugified" version of the given string
   * Replaces white space with dashes "-", removes non-alphanumeric characters, and lowercases
   * @param string
   * @returns
   */
  public static Slugify(string: string): string {
    return string
      .toLowerCase()
      .replace(Regex.WhiteSpace, '-')
      .replace(Regex.NonAlphaNumeric, '');
  }
}
