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

  // eslint-disable-next-line complexity
  private static getXmlStringFromValue(
    value: object | number | boolean | string,
    nodeName: string,
    schema?: string
  ): string {
    nodeName = isNaN(parseInt(nodeName)) ? nodeName : 'item';
    const getXmlNodeWithType = (type: NodeTypes, innerValue = value) =>
      `<${nodeName}${schema ? ` xmlns="${schema}"` : Strings.Empty} type="xs:${type}">${innerValue}</${nodeName}>`;

    const valueType = typeof value;

    if (['number', 'bigint'].includes(valueType)) {
      const isDecimal = value.toString().includes('.');
      return getXmlNodeWithType(isDecimal ? NodeTypes.Decimal : NodeTypes.Integer);
    }

    if (['string', 'boolean'].includes(valueType)) {
      return getXmlNodeWithType(valueType as NodeTypes);
    }

    if (valueType === 'object') {
      const isArray = Array.isArray(value);
      let content = '';
      for (const key in value as object) {
        const keyValue = (value as any)[key];
        content = content.concat(this.getXmlStringFromValue(keyValue, key));
      }
      return getXmlNodeWithType(isArray ? NodeTypes.Array : NodeTypes.Object, content);
    }

    throw new Error('Unable to parse xml from json');
  }

  /**
   * Returns the parsed json representation of the given xml string
   * @param xml
   */
  public static ToJson<T>(xml: string): T {
    return JSON.parse(xml) as T;
  }
}
