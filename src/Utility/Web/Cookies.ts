export class Cookies {
  private constructor() { }

  public static GetCookieMap(mainDocument?: Document): Map<string, string>;
  public static GetCookieMap(cookieValue: string): Map<string, string>;
  public static GetCookieMap(
    mainDocumentOrCookieValue: Document | string = document
  ): Map<string, string> {
    const cookieValue = typeof mainDocumentOrCookieValue === 'string' ? mainDocumentOrCookieValue : mainDocumentOrCookieValue.cookie;
    const map = new Map<string, string>();

    const cookiePairs = cookieValue.split(';').map(e => e.trim());
    const cookieKeys = cookiePairs.map(c => c.split('=')[0]);
    const cookieValues = cookiePairs.map(c => c.split('=')[1]);
    cookieKeys.forEach((key, i) => {
      map.set(key, cookieValues[i]);
    });

    return map;
  }
}
