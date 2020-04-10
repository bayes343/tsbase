/* eslint-disable complexity*/
import { ISerializer } from './ISerializer';
import { List } from '../../Collections/List';
import { Strings } from '../../Constants/Strings';

/**
 * Keys to check for simple values when data is structured as shown here:
 * example: field: [ { value: '1' } ]
 */
const keysToCheck = [
  'value',
  'target_id'
];

/**
 * Serializes raw json data into an instance of T
 * **Some conventions are necessary - see wiki for full details**
 * - No ***required*** constructor params
 * - Init all property values
 * - Array<T> / List<T> values must be initialized with a single instance inside
 */
export class JsonSerializer implements ISerializer {
  /**
   * Recursively serializes the data passed into an instance of t
   * @param t class type to instantiate
   * @param data data to initialize on instantiated class
   */
  public Serialize<T>(t: { new(): T; }, data: any): T {
    const object: any = new t();

    const classProperties = Object.keys(object);
    const jsonKeys = Object.keys(data);

    jsonKeys.forEach(element => {
      const instanceKey = this.getInstanceKey(classProperties, element);
      const jsonElement = data[element];
      if (instanceKey !== Strings.Empty && jsonElement) {
        const property = object[instanceKey];

        if (this.propertyIsSimple(property)) {
          this.serializeSimpleField(jsonElement, object, instanceKey);

        } else if (this.propertyIsGenericList(property)) {
          if (jsonElement.length && typeof jsonElement[0] !== 'object') {
            this.serializeSimpleField(jsonElement, object, instanceKey);
            object[instanceKey] = new List<any>(object[instanceKey]);
          } else {
            const values = this.getArrayValuesFromSerializer(property.Item[0], jsonElement);
            object[instanceKey] = new List<any>(values);
          }

        } else if (this.propertyIsArrayOfObjects(property)) {

          const values = this.getArrayValuesFromSerializer(property[0], jsonElement);
          object[instanceKey] = values;

        } else {
          const json = Array.isArray(jsonElement) ? jsonElement[0] : jsonElement;
          object[instanceKey] = this.getValueFromSerializer(property, json);
        }
      }
    });

    return object;
  }

  private getInstanceKey(fields: Array<string>, jsonKey: string): string {
    jsonKey = this.cleanString(jsonKey);
    let instanceKey = Strings.Empty;

    fields.forEach(element => {
      if (this.cleanString(element) === jsonKey) {
        instanceKey = element;
      }
    });

    return instanceKey;
  }

  private cleanString(stringToClean: string): string {
    return stringToClean.replace('field_', Strings.Empty)
      .replace(/[^a-zA-Z0-9]/g, Strings.Empty)
      .trim()
      .toLowerCase();
  }

  private propertyIsSimple(property: any): boolean {
    return Array.isArray(property) && typeof property[0] !== 'object' || typeof property !== 'object';
  }

  private propertyIsArrayOfObjects(property: any): boolean {
    return Array.isArray(property) && typeof property[0] === 'object';
  }

  private propertyIsGenericList(property: any): boolean {
    return property && property.constructor && property.constructor.name === 'List';
  }

  private getValueFromSerializer(property: any, json: any): any {
    const newSerializer = new JsonSerializer();
    try {
      return newSerializer.Serialize(property.constructor, json);
    } catch (error) {
      return new property.constructor();
    }
  }

  private getArrayValuesFromSerializer(property: any, json: any): Array<any> {
    const values = [];
    if (property) {
      for (const element of json) {
        values.push(this.getValueFromSerializer(property, element));
      }
    }
    return values;
  }

  private serializeSimpleField(jsonElement: any, object: any, instanceKey: string): void {
    if (!Array.isArray(jsonElement)) {
      object[instanceKey] = jsonElement;
    } else {
      if (jsonElement.length === 1) {
        object[instanceKey] = typeof jsonElement[0] === 'object' ?
          this.getSingleValue(jsonElement[0]) : [jsonElement[0]];
      } else if (jsonElement.length > 1) {
        object[instanceKey] = this.getArrayValue(jsonElement);
      }
    }
  }

  private getSingleValue(object: any): any {
    let value: any = null;

    keysToCheck.forEach(element => {
      if (object && object[element]) {
        value = object[element];
      }
    });

    return value;
  }

  private getArrayValue(array: Array<any>): any {
    const values = new Array<any>();

    array.forEach(element => {
      if (typeof element !== 'object') {
        values.push(element);
      } else {
        values.push(this.getSingleValue(element));
      }
    });

    return values;
  }

}
