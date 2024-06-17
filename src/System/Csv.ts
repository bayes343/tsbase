import { Query } from '../Patterns/CommandQuery/Query';
import { Regex } from './Regex';
import { Strings } from './Strings';

export class Csv {
  private constructor() { }

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

  /**
   * Accepts a csv string amd returns the JSON equivalent object.
   * @param csv
   * @param headerKeys sequential array of keys for each header in the given csv
   * @returns
  */
  public static DecodeAsJson<T extends object>(csv: string, headerKeys: Array<string | null>): T[] {
    const json = [] as T[];
    const lines = csv.split('\n');
    const headersString = lines.shift();
    const headers = headersString && Regex.AggregateMatches<string[]>(Regex.CsvData, headersString, [], (match, cv) => {
      match && cv.push(match[1]);
    });

    if (!headers || !headerKeys.length || headers.length !== headerKeys.length) {
      console.error(
        'Unable to decode CSV to JSON - ensure the given headerKeys is the same length as the CSV headers',
        `CSV Headers Count: ${headers?.length} | headerKeys Length: ${headerKeys.length}`
      );
      return json;
    }

    const valueString = lines.join('\n');
    const recordValues: string[][] = Regex.AggregateMatches<string[][]>(Regex.CsvData, valueString, [], (match, cv) => {
      if (cv.length === 0 || cv[cv.length - 1].length % headers.length === 0) {
        cv.push([]);
      }
      match && cv[cv.length - 1].push(match[1] || '');
    });

    recordValues.forEach(rv => {
      const entry = {} as any;
      headerKeys.forEach((k, i) => {
        if (k) {
          entry[k] = rv[i];
        }
      });
      json.push(entry);
    });
    return json;
  }

  // eslint-disable-next-line complexity
  private static convertToCSV(json: object) {
    const items = typeof json !== 'object' ? JSON.parse(json) : json;
    let str = Strings.Empty;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let line = Strings.Empty;
      for (const key in item) {
        if (line !== Strings.Empty) {
          line += ',';
        }
        const value = item[key];
        const literalQuotes = value?.toString().includes(',') ? '"' : '';
        line += value !== Strings.Empty ?
          `${literalQuotes}"${value}"${literalQuotes}` :
          Strings.Empty;
      }

      str += line + '\r\n';
    }

    return str.trim();
  }
}
