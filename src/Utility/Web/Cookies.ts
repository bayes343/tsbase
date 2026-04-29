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
    for (const pair of cookiePairs) {
      const key = pair.split('=', 2)[0];
      map.set(key, decodeURIComponent(pair.split(`${key}=`)[1]));
    }

    return map;
  }

  public static GetCookieValue(key: string, cookieString: string): string | null {
    return cookieString
      .split(';')
      .find((e) => e.trim().split('=', 2)[0] === key)
      ?.split(`${key}=`)[1] || null;
  }
}
