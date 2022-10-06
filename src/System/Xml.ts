import { Strings } from './Strings';

enum NodeTypes {
  String = 'string',
  Integer = 'integer',
  Decimal = 'decimal',
  Boolean = 'boolean',
  Object = 'object',
  Array = 'array'
}

export class Xml {
  private constructor() { }

  /**
   * Returns the XML string representation of the given json object
   * @param json
   */
  public static FromJson(json: object, rootNodeName = 'root', schema?: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>${this.getXmlStringFromValue(json, rootNodeName, schema)}`;
  }

  /**
   * Returns the parsed json representation of the given xml string
   * @param xml
   */
  public static ToJson<T>(xml: string): T {
    const xmlTagsRegex = /(?<openTag><(?<tagName>[^\s]*)[\s]?(?<typeAttribute>type="xs:(?<type>[^"]*)")?[^<]*>)(?<content>.*)(?<closeTag><\/\2>)/g;
    const results = xmlTagsRegex.exec(xml) as {
      groups?: {
        openTag?: string,
        tagName?: string,
        typeAttribute?: string,
        type?: string,
        content?: string,
        closeTag?: string,
      }[]
    };
    // eslint-disable-next-line no-console
    console.log(results);
    // eslint-disable-next-line no-console
    console.log(results.groups);

    return JSON.parse(xml) as T;
  }

  private static getXmlStringFromValue(
    value: object | number | boolean | string,
    nodeName: string,
    schema?: string
  ): string {
    nodeName = isNaN(parseInt(nodeName)) ? nodeName : 'item';
    const getXmlNodeWithType = (type: NodeTypes, innerValue = value) =>
      `<${nodeName}${schema ? ` xmlns="${schema}"` : Strings.Empty} type="xs:${type}">${innerValue}</${nodeName}>`;

    const getXmlFromNumber = () => {
      const isDecimal = value.toString().includes('.');
      return getXmlNodeWithType(isDecimal ? NodeTypes.Decimal : NodeTypes.Integer);
    };

    const valueType = typeof value;
    const valueTypeFunctionMap = new Map<string, () => string>([
      ['number', getXmlFromNumber],
      ['bigint', getXmlFromNumber],
      ['string', () => getXmlNodeWithType(valueType as NodeTypes)],
      ['boolean', () => getXmlNodeWithType(valueType as NodeTypes)],
      ['object', () => {
        const isArray = Array.isArray(value);
        let content = '';
        for (const key in value as object) {
          const keyValue = (value as any)[key];
          content = content.concat(this.getXmlStringFromValue(keyValue, key));
        }
        return getXmlNodeWithType(isArray ? NodeTypes.Array : NodeTypes.Object, content);
      }]
    ]);
    const valueTypeFunction = valueTypeFunctionMap.get(valueType);

    if (valueTypeFunction) {
      return valueTypeFunction();
    } else {
      throw new Error(`Unable to parse xml from type ${valueType}`);
    }
  }
}
