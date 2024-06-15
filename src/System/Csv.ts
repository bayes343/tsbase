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
    const headers = headersString && this.getCsvHeaders(headersString);

    if (!headers || !headerKeys.length || headers.length !== headerKeys.length) {
      console.error(
        'Unable to decode CSV to JSON - ensure the given headerKeys is the same length as the CSV headers',
        `CSV Headers Count: ${headers?.length} | headerKeys Length: ${headerKeys.length}`
      );
      return json;
    }

    const valueString = lines.join('\n');
    const recordValues: string[][] = Csv.getCsvRecordValues(valueString, headers);
    recordValues.forEach(lv => {
      const entry = {} as any;
      headerKeys.forEach((k, i) => {
        if (k) {
          entry[k] = lv[i];
        }
      });
      json.push(entry);
    });
    return json;
  }

  private static getCsvHeaders(headersString: string) {
    const headers: string[] = [];
    let match: RegExpExecArray | undefined | null;
    while ((match = Regex.CsvData.exec(headersString)) !== null) {
      if (match) {
        headers.push(match[1]);
      }
    }
    return headers;
  }

  private static getCsvRecordValues(valueString: string, headers: string[]) {
    const recordValues: string[][] = [];
    let match: RegExpExecArray | undefined | null;
    while ((match = Regex.CsvData.exec(valueString)) !== null) {
      if (recordValues.length === 0 || recordValues[recordValues.length - 1].length % headers.length === 0) {
        recordValues.push([]);
      }
      if (match) {
        recordValues[recordValues.length - 1].push(match[1] || '');
      }
    }
    return recordValues;
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
