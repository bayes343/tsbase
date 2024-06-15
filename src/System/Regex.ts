/**
 * Regular Expressions and Utilities
 */
export class Regex {
  private constructor() { }

  public static readonly NonAlphaNumeric = /[^a-zA-Z0-9 -]/g;
  public static readonly AnyString = /(.*)/;
  public static readonly WhiteSpace = /\s+/g;
  public static readonly XmlTag = /(<.[^(><.)]+>)/g;
  public static readonly CsvData = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;

  /**
   * Matches: whatever@somewhere.museum | foreignchars@myforeigncharsdomain.nu | me+mysomething@mydomain.com
   *
   * Non-Matches: a@b.c | me@.my.com | a@b.comFOREIGNCHAR
   */
  public static readonly Email = /^.+@[^\.].*\.[a-z]{2,}$/;

  /**
   * Matches: http://regxlib.com/Default.aspx | http://electronics.cnet.com/electronics/0-6342366-8-8994967-1.html
   *
   * Non-Matches: www.yahoo.com
   */
  public static readonly Uri = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;


  /**
   * Matches: 1234-1234-1234-1234 | 1234 1234 1234 1234 | 1234123412341234
   *
   * Non-Matches: Visa | 1234 | 123-1234-12345
   */
  public static readonly CreditCard = /^(\d{4}[- ]){3}\d{4}|\d{16}$/;

  /**
   * Matches: (111) 222-3333 | 1112223333 | 111-222-3333
   *
   * Non-Matches: 11122223333 | 11112223333 | 11122233333
   */
  public static readonly USPhoneNumber = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;

  /**
   * Matches: $3,023,123.34 | 9,876,453 | 123456.78
   *
   * Non-Matches: 4,33,234.34 | $1.234 | abc
   */
  public static readonly USCurrency = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9][0-9])?$/;

  /**
   * Matches: 14467 | 144679554 | 14467-9554
   *
   * Non-Matches: 14467 955 | 14467- | 1446-9554
   */
  public static readonly USPostalCode = /^[0-9]{5}([- /]?[0-9]{4})?$/;
};
