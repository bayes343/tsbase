import { Query } from '../Patterns/CommandQuery/Query';
import { Strings } from './Strings';

export class Csv {
  /**
   * Accepts a json object and returns the CSV string equivalent.
   * @param json
   */
  public static EncodeAsCsv(headers: Array<string>, json: object): string {
    const csvConversionResult = new Query(() => {
      return this.convertToCSV(json);
    }).Execute();

    return csvConversionResult.IsSuccess && csvConversionResult.Value ?
      `${headers.toString()}\r\n${csvConversionResult.Value}` :
      Strings.Empty;
  }

  private static convertToCSV(json: object) {
    const array = typeof json !== 'object' ? JSON.parse(json) : json;
    let str = Strings.Empty;

    for (let i = 0; i < array.length; i++) {
      let line = Strings.Empty;
      for (const index in array[i]) {
        if (line !== Strings.Empty) { line += ','; }
        const value = array[i][index];
        line += value !== Strings.Empty ? `"${value}"` : Strings.Empty;
      }

      str += line + '\r\n';
    }

    return str.trim();
  }
}
