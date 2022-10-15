import { Strings } from './Strings';

type Tag = {
  openTag?: string,
  tagName?: string,
  typeAttribute?: string,
  type?: string,
  content?: string,
  closeTag?: string,
};

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
    const results: Tag[] = [];
    let match: RegExpExecArray | undefined | null;
    while ((match = xmlTagsRegex.exec(xml)) !== null) {
      if (match) {
        results.push(match.groups as Tag);
      }
    }
    let obj = {};

    // eslint-disable-next-line complexity
    results.forEach(tag => {
      if (tag.tagName === 'root') {
        obj = this.ToJson(tag.content || '');
      } else if (tag.type === 'object') {
        const nestedObj = this.ToJson(tag.content || '');
        obj = {
          ...obj,
          [tag.tagName as string]: nestedObj
        };
      } else if (tag.type === 'string') {
        obj = {
          ...obj,
          [tag.tagName as string]: tag.content?.toString()
        };
      } else if (tag.type === 'integer') {
        obj = {
          ...obj,
          [tag.tagName as string]: parseInt(tag.content || '0')
        };
      } else if (tag.type === 'decimal') {
        obj = {
          ...obj,
          [tag.tagName as string]: parseFloat(tag.content || '0')
        };
      } else if (tag.type === 'boolean') {
        obj = {
          ...obj,
          [tag.tagName as string]: tag.content === 'true'
        };
      } else if (tag.type === 'array') {
        // eslint-disable-next-line max-len
        const xmlArrayItemsRegex = /(?<openTag><(?<tagName>[^\s]*)[\s]?(?<typeAttribute>type="xs:(?<type>[^"]*)")?[^<]*>)(?<content>[^<]*)(?<closeTag><\/\2>)/g;
        const items: any[] = [];
        let match: RegExpExecArray | undefined | null;
        while ((match = xmlArrayItemsRegex.exec(tag.content || '')) !== null) {
          if (match) {
            items.push((match.groups as Tag).content);
          }
        }
        obj = {
          ...obj,
          [tag.tagName as string]: items
        };
      }
    });

    return obj as T;
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
