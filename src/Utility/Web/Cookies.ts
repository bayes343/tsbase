export class Cookies {
  private constructor() { }

  public static GetCookieMap(
    mainDocument = document
  ): Map<string, string> {
    const map = new Map<string, string>();

    const cookiePairs = mainDocument.cookie.split(';').map(e => e.trim());
    const cookieKeys = cookiePairs.map(c => c.split('=')[0]);
    const cookieValues = cookiePairs.map(c => c.split('=')[1]);
    cookieKeys.forEach((key, i) => {
      map.set(key, cookieValues[i]);
    });

    return map;
  }
}
