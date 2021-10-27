import { Strings } from './Strings';

export class FormUrl {
  private constructor() { }

  /**
   * Returns the form url encoded string version of the given json object.
   * Intended for json consisting of string values only.
   * @param json
   */
  public static EncodeJson(json: any): string {
    let formData = Strings.Empty;

    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      formData += `${key}=${json[key]}${i < keys.length - 1 ? '&' : Strings.Empty}`;
    }

    return formData;
  }

  /**
   * Returns the json version of the form url encoded string given.
   * @param formData
   */
  public static DecodeToJson(formData: string): any {
    const json: any = {};

    if (formData.indexOf('=') >= 0) {
      if (formData.indexOf('&') >= 0) {
        const keyValuePairs = formData.split('&');
        keyValuePairs.forEach(keyValuePair => {
          FormUrl.SetKeyValuePair(keyValuePair, json);
        });
      } else {
        FormUrl.SetKeyValuePair(formData, json);
      }
    }

    return json;
  }

  private static SetKeyValuePair(formData: string, json: any) {
    const keyValuePair = formData.split('=');
    if (keyValuePair.length >= 2) {
      json[keyValuePair[0]] = keyValuePair[1];
    }
  }
}
