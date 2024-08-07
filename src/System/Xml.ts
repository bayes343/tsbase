import { Regex } from './Regex';
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

/**
 * This feature is currently in development - it is not exported from System/module or the package root for this reason.
 * It may meet your needs, however, it may change significantly without being reflected such in the package version
 */
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
    const results = Regex.AggregateMatches<Tag[]>(xmlTagsRegex, xml, [], (match, cv) => {
      if (match) {
        cv.push(match.groups as Tag);
      }
    });

    const getValueForTypeFunctionMap = new Map<NodeTypes, (tag: Tag) => undefined | string | number | boolean | object | Array<any>>([
      [NodeTypes.Object, (tag) => this.ToJson(tag.content || '')],
      [NodeTypes.String, (tag) => tag.content?.toString().trim()],
      [NodeTypes.Integer, (tag) => parseInt(tag.content || '0')],
      [NodeTypes.Decimal, (tag) => parseFloat(tag.content || '0')],
      [NodeTypes.Boolean, (tag) => tag.content === 'true'],
      [NodeTypes.Array, (tag) => {
        // eslint-disable-next-line max-len
        const xmlArrayItemsRegex = /(?<openTag><(?<tagName>[^\s]*)[\s]?(?<typeAttribute>type="xs:(?<type>[^"]*)")?[^<]*>)(?<content>[^<]*)(?<closeTag><\/\2>)/g;
        return Regex.AggregateMatches<any[]>(xmlArrayItemsRegex, tag.content || '', [], (match, cv) => {
          if (match) {
            const valueFunction = getValueForTypeFunctionMap.get((match.groups as Tag).type as NodeTypes);
            cv.push(valueFunction ? valueFunction(match.groups as Tag) : (match.groups as Tag).content);
          }
        });
      }]
    ]);

    let obj = {};

    results.forEach(tag => {
      const type = tag.type || (() => {
        if (['array', 'set', 'list'].some(e => tag.tagName?.includes(e) || '')) {
          return NodeTypes.Array;
        } else if (tag.content?.includes('</')) {
          return NodeTypes.Object;
        } else {
          return NodeTypes.String;
        }
      })();
      if (tag.tagName) {
        if (tag.tagName === 'root') {
          obj = this.ToJson(tag.content || '');
        } else {
          const valueFunction = getValueForTypeFunctionMap.get(type as NodeTypes);
          obj = {
            ...obj,
            [tag.tagName]: valueFunction ? valueFunction(tag) : tag.content
          };
        }
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
